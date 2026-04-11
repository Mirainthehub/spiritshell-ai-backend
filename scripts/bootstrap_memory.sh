#!/usr/bin/env bash
# 初始化 MemPalace：生成 palace（Chroma）并索引 data/corpus 下的文本。
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
export MEMPALACE_PALACE_PATH="${MEMPALACE_PALACE_PATH:-$ROOT/data/palace}"

mkdir -p "$ROOT/data/corpus/spiritshell"
echo "Palace path: $MEMPALACE_PALACE_PATH"
echo "Corpus:      $ROOT/data/corpus"

cd "$ROOT"
mempalace init data/corpus --yes
mempalace mine data/corpus --wing spiritshell --no-gitignore

echo "Done. Point MEMPALACE_PALACE_PATH to: $MEMPALACE_PALACE_PATH"
