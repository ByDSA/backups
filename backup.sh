#!/bin/bash

# SUDO required
if [[ $UID != 0 ]]; then
    echo "Please run this script with sudo:"
    echo "sudo $0 $*"
    exit 1
fi

# Constants
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Functions

# $1: folder1
# $2: folder2
function isEqual() {
    FOLDER1=$1
    FOLDER2=$2
    OUT_EQ=$(diff -qr "$FOLDER1" "$FOLDER2")
    if [[ $OUT_EQ ]]; then
        echo "$OUT_EQ"
        return 0
    else
        return 1
    fi
}

# $1: input folder
# $2: out iso file
function makeISO() {
    echo -e "${BLUE}Creating ISO '$2'...${NC}"
    mkisofs -allow-limited-size -iso-level 4 -J -joliet-long -l -R -o "$2" "$1"
    if [ ! -f "$2" ]; then
        echo -e "${RED}ISO not exists! $2 ${NC}"
        exit 1
    fi
}

# $1: input folder
# $2: out iso file
function integrityISO() {
    TMP=$(dirname "$1")/$(basename "$1")_bkptmp
    if [ -d "$TMP" ]; then
        umount "$TMP" && rm -rf "$TMP" || TMP=${TMP}2
    fi
    mkdir "$TMP"
    sudo mount -t iso9660 -o loop,ro,map=off,check=relaxed "$2" "$TMP"
    OUT_EQ=$(isEqual "$1" "$TMP")
    OUT_CODE=$?

    if [[ $OUT_CODE == 0 ]]; then
        echo -e "${RED}ISO is not equal as base folder!${NC}"
        printf "$OUT_EQ\n"
        exit 1
    fi

    umount "$TMP"
    rm -rf "$TMP"
}

# Params
params=$( getopt -a -o 'oi:ft:cd' -l output,input:,force,type:,check-after,delete-after -- "$@")

if [[ $? -ne 0 ]] ; then
    exit 1
fi

eval set -- "$params"

DELETE_AFTER=0
FORCE=0
while [[ $# -gt 0 ]]; do
  case $1 in
    -o|--output) OUT="$2"; shift 2;;
    -f|--force)  FORCE=1; shift 1;;
    -t|--type)   TYPE="$2"; shift 2;;
    -c|--check-after) CHECK_AFTER=1; shift 1;;
    -d|--delete-after) DELETE_AFTER=1; shift 1;;
    --) shift; break ;;
    *) break ;;
  esac
done
INPUT=$1

if [ -z "$TYPE" ]; then
    echo -e "${RED}No type \"-t\" specified!${NC}"
    exit
fi

# Script
echo -e "${BLUE}[Backup: '$INPUT']${NC}"
echo "Out: $OUT"
echo "Input: $INPUT"
echo "Force: $FORCE"
echo "Type: $TYPE"
echo "Check after: $CHECK_AFTER"
echo "Delete after: $DELETE_AFTER"

TIMESTAMP=" [$(date +%Y-%m-%d)]"
case $TYPE in
  iso)
    if [ ! -z "$OUT" ]; then
        if [[ -d "$OUT" ]]; then
          OUT_FOLDER=$OUT
        elif [[ -d "$(dirname \"$OUT\")" ]]; then
          OUT_FOLDER=$(dirname "$OUT")
        fi
    else
      OUT_FOLDER=$(dirname "$INPUT")
    fi
    
    OUT=$OUT_FOLDER/$(basename "$INPUT")${TIMESTAMP}.iso
    OUT_TYPE=f
  ;;
esac

if [ "$FORCE" == "1" ]; then
    if [ "$OUT_TYPE" == "f" ]; then
        rm -f "$OUT"
    elif [ "$OUT_TYPE" == "d" ]; then
        rm -rf "$OUT"
    fi
fi

case $TYPE in
  iso)
    makeISO "$INPUT" "$OUT"
  ;;
esac

if [ "$CHECK_AFTER" == "1" ]; then
    echo -e "${BLUE}Check backup integrity ...${NC}"
    case $TYPE in
      iso) integrityISO "$INPUT" "$OUT"
      ;;
    esac
fi

if [[ "$DELETE_AFTER" == "1" ]]; then
    echo -e "${BLUE}Deleting base source ...${NC}"
    rm -rf "$INPUT"
fi
