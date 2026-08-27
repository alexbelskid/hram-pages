#!/usr/bin/env bash
set -euo pipefail
umask 077
DB=/var/lib/hram-notes/hram.sqlite
OUT=/var/backups/hram-notes
mkdir -p "$OUT"
STAMP=$(date -u +%Y%m%dT%H%M%SZ)
TMP="$OUT/hram-$STAMP.sqlite"
sqlite3 "$DB" ".backup '$TMP'"
gzip "$TMP"
find "$OUT" -type f -name 'hram-*.sqlite.gz' -mtime +14 -delete
sha256sum "$TMP.gz" > "$TMP.gz.sha256"
