#!/bin/bash

# === set var ===
SOURCE_DIR="jumpcat"
OUTPUT_FILE="./zip/dist.7z"
LIMIT_KB=13

if [ ! -d "$SOURCE_DIR" ]; then
  echo "❌ folder '$SOURCE_DIR' not found."
  exit 1
fi

[ -f "$OUTPUT_FILE" ] && rm "$OUTPUT_FILE"

echo "🔄 Start zipping '$SOURCE_DIR' → '$OUTPUT_FILE'..."
7z a -t7z -mx=9 "$OUTPUT_FILE" "$SOURCE_DIR/*" > /dev/null

if [ ! -f "$OUTPUT_FILE" ]; then
  echo "❌ zip fail."
  exit 2
fi

SIZE_BYTES=$(stat --printf="%s" "$OUTPUT_FILE")
SIZE_KB=$((SIZE_BYTES / 1024))

echo "📦 7z zip finish : ${SIZE_KB} KB"

if [ "$SIZE_KB" -gt "$LIMIT_KB" ]; then
  echo "❌ out of ${LIMIT_KB} KB"
  exit 1
fi