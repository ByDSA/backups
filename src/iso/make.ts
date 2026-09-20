import chalk from "chalk";
import { execFileSync, spawnSync } from "node:child_process";
import {
  type BigIntStats,
  lstatSync,
  mkdtempSync,
  readdirSync,
  rmdirSync,
  rmSync,
  statfsSync,
  statSync,
  truncateSync,
  writeFileSync,
} from "node:fs";
import { tmpdir, userInfo } from "node:os";
import { basename, join, posix } from "node:path";
import type { Tree } from "#src/tree/index.js";

type Options = {
  tree?: Tree;
};

type Cs0Bits = 8 | 16;

type VolumeIds = { vid: string; lvid: string };

type SourceSummary = {
  files: number;
  directories: number;
  dataBytes: number;
};

type ImagePlan = {
  volume: VolumeIds;
  imageBytes: number;
  entryCount: number;
  source: SourceSummary;
  fixedOverheadBytes: number;
};

type SourceScan = {
  files: number;
  directories: number;
  dataBytes: number;
  listingBlocks: number;
  problems: string[];
  inodeOwners: Map<string, string>;
  sharedInodes: string[];
};

const UDF_REVISION = "0x0201";
const MEDIA_TYPE = "hd";
const BLOCK_SIZE = 2048;

// ---------------------------------------------------------------------------
// Image size: content + UDF structural overhead. The overhead has two parts:
//
//   - A part that scales with the image size: the space bitmap (UDF's
//     Unallocated Space Bitmap Descriptor), exactly 1 bit per block. This is
//     computable in closed form (see bitmapBytesFor) — no need to guess it.
//
//   - A part that does NOT scale with anything: system area, volume
//     recognition sequence, anchor volume descriptor pointers, main/reserve
//     volume descriptor sequences, logical volume integrity descriptor, file
//     set descriptor, root directory's own file entry. This is fixed no
//     matter how much content goes in, but its exact byte count depends on
//     the mkudffs version/build, which isn't something to hardcode from
//     memory. Instead it's measured once per run by formatting a tiny probe
//     image with the real mkudffs binary and reading back how much of it
//     stayed usable (see measureFixedOverhead). No percentage anywhere.
// ---------------------------------------------------------------------------

// Size of the throwaway probe image used to measure the fixed overhead. Any size
// comfortably above the block-256 anchor requirement works; 64 MiB keeps
// format+mount+unmount well under a second, and the tiny approximation this
// introduces (splitting "total probe bytes" into "fixed part" + "probe's own
// bitmap" as if the whole probe were partition, when a small fixed prefix
// actually sits outside the partition) is on the order of single-digit bytes —
// irrelevant next to a 70 GiB image.
const PROBE_BYTES = 64 * 1024 ** 2;

// Extra margin, in whole blocks, added on top of the calculated size. NOT a
// percentage, so it never grows with the image. Defaults to 0: the fixed
// overhead is measured against the real mkudffs binary and the bitmap is exact,
// so no padding should be needed. Raise it only if the copy-failure diagnostic
// shows a genuine shortfall with an unchanged source.
const EXTRA_SAFETY_BLOCKS = 0;

// UDF limits. Names are OSTA CS0: 1 compression-id byte + 8-bit or 16-bit units.
const MAX_COMPONENT_UNITS: Record<Cs0Bits, number> = { 8: 254, 16: 127 };
const MAX_PATH_BYTES = 1023;
const FID_HEADER_BYTES = 38;
const VID_FIELD_BYTES = 32;
const LVID_FIELD_BYTES = 128;
const FORBIDDEN_CODEPOINTS = new Set([0xFEFF, 0xFFFE]);
const NEEDS_16_BITS = /[\u{100}-\u{10FFFF}]/u;

const REPORT_LIST_LIMIT = 50;

/**
 * Creates a pure UDF 2.01 image (no ISO9660/Joliet bridge): mkudffs formats a sparse image,
 * the image is loop-mounted (requires root) and `inputFolder` is copied into it.
 *
 * UDF has neither the 4 GiB file limit nor Joliet's 103-char names, so `opts.tree` is no longer
 * needed: names, paths and inode collisions are validated by scanning `inputFolder` itself.
 */
export default function make(inputFolder: string, outputISO: string, _opts?: Options) {
  console.log(chalk.blue(`Creating ISO '${outputISO}'...`));

  assertDependencies();
  assertIsDirectory(inputFolder);

  const plan = planImage(inputFolder);

  createImage(inputFolder, outputISO, plan);

  console.log(chalk.green(`ISO created: ${outputISO}`));
}

// ---------------------------------------------------------------------------
// Preconditions
// ---------------------------------------------------------------------------

function assertDependencies() {
  const required = ["mkudffs", "mount", "umount"];
  const missing = required.filter((program) => !commandExists(program));

  if (missing.length === 0)
    return;

  const hint = missing.includes("mkudffs") ? "\nmkudffs is in the 'udftools' package (apt install udftools)" : "";

  throw new Error(`Missing required programs: ${missing.join(", ")}${hint}`);
}

function assertIsDirectory(folder: string) {
  if (!statSync(folder, { throwIfNoEntry: false })?.isDirectory())
    throw new Error(`Input folder does not exist or is not a directory: ${folder}`);
}

// ---------------------------------------------------------------------------
// Planning: volume ids, validation and size calculation
// ---------------------------------------------------------------------------

function planImage(inputFolder: string): ImagePlan {
  const volume = buildVolumeIds(basename(inputFolder));

  console.log("Validating names and paths for UDF...");

  const scan = scanSource(inputFolder);

  assertScanIsValid(scan);
  console.log(`Validated ${scan.directories} directories and ${scan.files} files.`);

  console.log("Measuring mkudffs' fixed overhead (formats + mounts a small probe image, needs root)...");

  const fixedOverheadBytes = measureFixedOverhead();

  console.log(`Fixed overhead: ${toMiB(fixedOverheadBytes)} MiB (measured against the real mkudffs binary).`);

  const imageBytes = estimateImageBytes(scan, fixedOverheadBytes);

  console.log(`Calculated image size: ${toMiB(imageBytes)} MiB.`);

  return {
    volume,
    imageBytes,
    entryCount: scan.files + scan.directories,
    source: { files: scan.files, directories: scan.directories, dataBytes: scan.dataBytes },
    fixedOverheadBytes,
  };
}

// UDF label fields are Unicode, so the folder name is used as is and only truncated if it doesn't fit.
function buildVolumeIds(folderName: string): VolumeIds {
  const vid = fitDString(folderName, VID_FIELD_BYTES);
  const lvid = fitDString(folderName, LVID_FIELD_BYTES);

  if (vid.truncated || lvid.truncated) {
    console.log(chalk.yellow(
      "Folder name truncated to fit the UDF identifier fields:\n"
      + `  Folder             : ${folderName}\n`
      + `  Volume Identifier  : ${vid.value}${vid.truncated ? " (truncated)" : ""}\n`
      + `  Logical Volume ID  : ${lvid.value}${lvid.truncated ? " (truncated, this is the visible label)" : ""}`,
    ));
  }

  return { vid: vid.value, lvid: lvid.value };
}

// A dstring field spends 1 byte on the compression id and 1 on the length.
function fitDString(text: string, fieldBytes: number): { value: string; truncated: boolean } {
  const value = text.normalize("NFC");
  const { bits, units } = cs0Length(value);
  const maxUnits = bits === 8 ? fieldBytes - 2 : Math.floor((fieldBytes - 2) / 2);

  if (units <= maxUnits)
    return { value, truncated: false };

  let fitted = "";
  let used = 0;

  // Whole code points only, so surrogate pairs are never split.
  for (const char of value) {
    if (used + char.length > maxUnits)
      break;

    fitted += char;
    used += char.length;
  }

  return { value: fitted, truncated: true };
}

/**
 * Single walk over the source that validates every name/path against UDF 2.01 limits, sizes the
 * image and detects files sharing (device, inode).
 */
function scanSource(root: string): SourceScan {
  const scan: SourceScan = {
    files: 0,
    directories: 0,
    dataBytes: 0,
    listingBlocks: 0,
    problems: [],
    inodeOwners: new Map(),
    sharedInodes: [],
  };

  const scanDirectory = (relativeDir: string, parentPathBytes: number): void => {
    let listingBytes = 0;

    for (const name of readdirSync(join(root, relativeDir)).sort()) {
      const relativePath = posix.join(relativeDir, name);
      const stats = lstatSync(join(root, relativePath), { bigint: true });
      const normalized = name.normalize("NFC");
      const pathBytes = parentPathBytes + cs0Bytes(normalized);

      scan.problems.push(...findNameProblems(normalized, relativePath, pathBytes));
      listingBytes += fidBytes(normalized);

      if (stats.isDirectory()) {
        scan.directories++;

        // Every descendant of an over-long path is over-long too: it is reported once.
        if (pathBytes <= MAX_PATH_BYTES)
          scanDirectory(relativePath, pathBytes);
      } else {
        scan.files++;

        if (stats.isFile()) {
          scan.dataBytes += roundUpToBlock(Number(stats.size));
          trackInode(scan, stats, relativePath);
        }
      }
    }

    scan.listingBlocks += Math.max(1, blocksFor(listingBytes));
  };

  scanDirectory("", 0);

  return scan;
}

function findNameProblems(name: string, relativePath: string, pathBytes: number): string[] {
  const problems: string[] = [];
  const forbidden = findForbiddenCodepoint(name);

  if (forbidden !== undefined)
    problems.push(`Forbidden character U+${forbidden.toString(16).toUpperCase().padStart(4, "0")}: ${relativePath}`);

  const { bits, units } = cs0Length(name);

  if (units > MAX_COMPONENT_UNITS[bits])
    problems.push(`Name too long (${units} > ${MAX_COMPONENT_UNITS[bits]} ${bits}-bit units): ${relativePath}`);

  if (pathBytes > MAX_PATH_BYTES)
    problems.push(`Path too long (${pathBytes} > ${MAX_PATH_BYTES} bytes): ${relativePath}`);

  return problems;
}

function findForbiddenCodepoint(name: string): number | undefined {
  for (const char of name) {
    const codepoint = char.codePointAt(0) ?? 0;

    if (codepoint < 0x20 || FORBIDDEN_CODEPOINTS.has(codepoint))
      return codepoint;
  }

  return undefined;
}

function trackInode(scan: SourceScan, { dev, ino }: BigIntStats, relativePath: string) {
  const key = `${dev}:${ino}`;
  const owner = scan.inodeOwners.get(key);

  if (owner === undefined)
    scan.inodeOwners.set(key, relativePath);
  else
    scan.sharedInodes.push(`${owner}  <->  ${relativePath}`);
}

/**
 * Shared (device, inode) pairs abort the run: exFAT invents inode numbers and unrelated files can
 * collide. Nothing in the copy step can neutralize that for sure, and hard links are never
 * preserved by the copy (no --preserve=links), so each file always gets its own content.
 */
function assertScanIsValid({ problems, sharedInodes }: SourceScan) {
  if (problems.length > 0)
    throw new Error(`UDF validation failed (${problems.length} problem(s)):\n${formatList(problems)}`);

  if (sharedInodes.length > 0) {
    throw new Error(
      `Files sharing the same (device, inode) in the source (typical of exFAT):\n${formatList(sharedInodes)}\n`
      + "Review them, or copy the tree to a filesystem with real inodes (ext4, ...) and try again.",
    );
  }
}

// Bytes the content itself needs inside the volume: block-rounded data + 1 File Entry block per
// file and per directory + the FID listing of every directory. No volume structures.
function contentBytes({ files, directories, dataBytes, listingBlocks }: SourceScan): number {
  return dataBytes + (files + directories + listingBlocks) * BLOCK_SIZE;
}

// Exact size of UDF's space bitmap for an image of this many bytes: 1 bit per block,
// block-rounded because it's allocated as whole blocks on the medium like everything else.
function bitmapBytesFor(totalBytes: number): number {
  const totalBlocks = Math.ceil(totalBytes / BLOCK_SIZE);

  return roundUpToBlock(Math.ceil(totalBlocks / 8));
}

function estimateImageBytes(scan: SourceScan, fixedOverheadBytes: number): number {
  const base = contentBytes(scan) + fixedOverheadBytes;
  const bitmap = bitmapBytesFor(base);

  return roundUpToBlock(base + bitmap) + EXTRA_SAFETY_BLOCKS * BLOCK_SIZE;
}

/**
 * Measures, against the real mkudffs binary, how many bytes it spends on UDF structures that
 * don't depend on the content (system area, volume recognition sequence, anchor pointers, main
 * and reserve volume descriptor sequences, logical volume integrity descriptor, file set
 * descriptor, root directory's file entry...), instead of hardcoding assumptions about mkudffs
 * internals that vary between versions.
 *
 * A small sparse image is formatted and mounted; on an empty volume, raw size minus what's
 * actually free IS the total overhead. That total still includes the probe's own space bitmap
 * (which scales with size), so it's subtracted back out using the exact formula, leaving just
 * the size-independent part.
 */
function measureFixedOverhead(): number {
  const probeDir = mkdtempSync(join(tmpdir(), "iso_gen_udf_probe."));
  const probePath = join(probeDir, "probe.img");
  const mountPoint = mkdtempSync(join(tmpdir(), "iso_gen_udf_probe_mnt."));
  let mounted = false;

  try {
    writeFileSync(probePath, "");
    truncateSync(probePath, PROBE_BYTES);

    run("mkudffs", [
      "--locale",
      `--media-type=${MEDIA_TYPE}`,
      `--blocksize=${BLOCK_SIZE}`,
      `--udfrev=${UDF_REVISION}`,
      "--lvid=PROBE",
      "--vid=PROBE",
      probePath,
    ]);

    run("mount", ["-t", "udf", "-o", "loop,ro", probePath, mountPoint]);
    mounted = true;

    const { bsize, bfree } = statfsSync(mountPoint);
    const usableBytes = bfree * bsize; // empty volume: every free block is free space

    run("umount", [mountPoint]);
    mounted = false;

    const overheadWithBitmap = PROBE_BYTES - usableBytes;

    return overheadWithBitmap - bitmapBytesFor(PROBE_BYTES);
  } finally {
    const unmounted = !mounted || tryUnmount(mountPoint);

    if (unmounted)
      rmdirSync(mountPoint);

    rmSync(probeDir, { recursive: true, force: true });
  }
}

// ---------------------------------------------------------------------------
// Image creation: allocate, format, mount, copy, unmount
// ---------------------------------------------------------------------------

function createImage(inputFolder: string, outputISO: string, plan: ImagePlan) {
  const mountPoint = mkdtempSync(join(tmpdir(), "iso_gen_udf."));
  let mounted = false;
  let completed = false;

  try {
    formatImage(outputISO, plan);

    console.log("Mounting image...");

    const { uid, gid } = userInfo();

    run("mount", ["-t", "udf", "-o", `loop,rw,uid=${uid},gid=${gid}`, outputISO, mountPoint]);
    mounted = true;

    copyContents(inputFolder, mountPoint, plan);

    console.log("Unmounting...");
    run("sync", []);
    run("umount", [mountPoint]);
    mounted = false;
    completed = true;
  } finally {
    const unmounted = !mounted || tryUnmount(mountPoint);

    if (unmounted)
      rmdirSync(mountPoint);

    // Never leave a half-written image that could be mistaken for a valid one.
    if (!completed)
      rmSync(outputISO, { force: true });
  }
}

function formatImage(outputISO: string, { volume, imageBytes }: ImagePlan) {
  console.log(`Creating sparse image (${toMiB(imageBytes)} MiB)...`);
  writeFileSync(outputISO, "");
  truncateSync(outputISO, imageBytes);

  console.log(`Formatting UDF ${UDF_REVISION} (mkudffs)...`);
  run("mkudffs", [
    "--locale",
    `--media-type=${MEDIA_TYPE}`,
    `--blocksize=${BLOCK_SIZE}`,
    `--udfrev=${UDF_REVISION}`,
    `--lvid=${volume.lvid}`,
    `--vid=${volume.vid}`,
    outputISO,
  ]);
}

function copyContents(inputFolder: string, mountPoint: string, plan: ImagePlan) {
  console.log("Copying files into the image...");

  try {
    // '/.' copies the folder's contents, not the folder itself. Ownership is not preserved (the
    // mount already sets uid/gid) and neither are hard links.
    run("cp", ["-R", "--no-dereference", "--preserve=mode,timestamps", "--", `${inputFolder}/.`, `${mountPoint}/`]);
  } catch (error) {
    // Still mounted here, so the real capacity of the image can be read.
    throw new Error(describeCopyFailure(inputFolder, mountPoint, plan.source), { cause: error });
  }

  // Not a content check, but it catches incomplete copies.
  const copiedEntries = readdirSync(mountPoint, { recursive: true }).length;

  if (copiedEntries !== plan.entryCount)
    throw new Error(`Copied entries (${copiedEntries}) don't match the source (${plan.entryCount}).`);

  const { bsize, blocks, bfree } = statfsSync(mountPoint);

  console.log(`Copy completed: ${toMiB((blocks - bfree) * bsize)} MiB used, ${toMiB(bfree * bsize)} MiB free.`);
}

/**
 * Builds the error shown when `cp` fails: rescans the source (it may have changed while copying,
 * which takes a while) and compares it with the usable capacity of the mounted image and with the
 * scan made at planning time, to tell "the source grew" apart from "the calculation was too low".
 */
function describeCopyFailure(inputFolder: string, mountPoint: string, planned: SourceSummary): string {
  const header = "Copy into the image failed (see the cp error above).";

  try {
    const { bsize, blocks, bfree } = statfsSync(mountPoint);
    const capacity = blocks * bsize;
    const used = (blocks - bfree) * bsize;

    const scan = scanSource(inputFolder);
    const needed = contentBytes(scan);

    const changed = scan.files !== planned.files
      || scan.directories !== planned.directories
      || scan.dataBytes !== planned.dataBytes;

    const delta = scan.dataBytes - planned.dataBytes;
    const changeLine = `Source at scan time: ${planned.files} files, ${toMiB(planned.dataBytes)} MiB of data. `
      + `Now: ${scan.files} files, ${toMiB(scan.dataBytes)} MiB of data `
      + `(${delta >= 0 ? "+" : "-"}${toMiB(Math.abs(delta))} MiB).`;

    const lines = [header];

    if (needed > capacity) {
      lines.push(
        `Not enough space: ${toMiB(needed)} MiB of content (data + metadata) cannot fit in an image `
        + `with ${toMiB(capacity)} MiB of usable space (${toMiB(needed - capacity)} MiB short).`,
      );
    } else {
      lines.push(
        `The content (${toMiB(needed)} MiB) should fit in the ${toMiB(capacity)} MiB of usable space, `
        + "so this may not be a space problem.",
      );
    }

    lines.push(`Image when it failed: ${toMiB(used)} MiB used, ${toMiB(capacity - used)} MiB free.`);

    if (changed) {
      lines.push(`The source CHANGED after it was scanned. ${changeLine}`);
    } else if (needed > capacity) {
      lines.push(
        "The source did NOT change after it was scanned: the calculated size was too low. "
        + "The fixed overhead is measured against the real mkudffs binary and the bitmap is exact, "
        + "so this would mean that measurement was off for this run. Try EXTRA_SAFETY_BLOCKS > 0.",
      );
    }

    return lines.join("\n");
  } catch (diagnosticError) {
    const reason = diagnosticError instanceof Error ? diagnosticError.message : String(diagnosticError);

    return `${header}\nCould not compute the sizes to diagnose it (did the source change while scanning?): ${reason}`;
  }
}

function tryUnmount(mountPoint: string): boolean {
  try {
    run("umount", [mountPoint]);

    return true;
  } catch {
    console.log(chalk.yellow(`Could not unmount ${mountPoint}. Do it manually: umount "${mountPoint}"`));

    return false;
  }
}

// ---------------------------------------------------------------------------
// OSTA CS0 / block arithmetic
// ---------------------------------------------------------------------------

// 8-bit if every char is <= U+00FF, otherwise 16-bit (UTF-16 units; JS string length already is that).
function cs0Length(text: string): { bits: Cs0Bits; units: number } {
  return { bits: NEEDS_16_BITS.test(text) ? 16 : 8, units: text.length };
}

function cs0Bytes(text: string): number {
  const { bits, units } = cs0Length(text);

  return 1 + units * (bits / 8);
}

// Approximate size of a File Identifier Descriptor: fixed header + CS0 name, padded to 4 bytes.
function fidBytes(name: string): number {
  return Math.ceil((FID_HEADER_BYTES + cs0Bytes(name)) / 4) * 4;
}

function blocksFor(bytes: number): number {
  return Math.ceil(bytes / BLOCK_SIZE);
}

function roundUpToBlock(bytes: number): number {
  return blocksFor(bytes) * BLOCK_SIZE;
}

function toMiB(bytes: number): number {
  return Math.round(bytes / 1024 ** 2);
}

function formatList(items: string[]): string {
  const lines = items.slice(0, REPORT_LIST_LIMIT).map((item) => `  - ${item}`);

  if (items.length > REPORT_LIST_LIMIT)
    lines.push(`  ... and ${items.length - REPORT_LIST_LIMIT} more`);

  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Process helpers
// ---------------------------------------------------------------------------

function run(file: string, args: string[]) {
  execFileSync(file, args, {
    stdio: "inherit",
    env: { ...process.env, LC_ALL: "C.UTF-8", LANG: "C.UTF-8" },
  });
}

function succeeds(file: string, args: string[]): boolean {
  return spawnSync(file, args, { stdio: "ignore" }).status === 0;
}

function commandExists(program: string): boolean {
  return succeeds("sh", ["-c", "command -v \"$1\"", "sh", program]);
}