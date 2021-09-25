import { execSync } from "child_process";

export function checkSudo() {
  const uid = process.env.SUDO_UID;

  return !!uid;
}

export function forceSudo() {
  if (!checkSudo()) {
    console.log("Please run this script with sudo.");
    process.exit(1);
  }
}

export function cmd(c: string) {
  return execSync(c, {
    stdio: "inherit",
  } );
}
