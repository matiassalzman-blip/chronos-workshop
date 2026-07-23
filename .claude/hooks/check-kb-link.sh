#!/usr/bin/env bash
# SessionStart hook: surfaces whether this prototype has a linked Knowledge Base,
# so a fresh session can offer to run repo-init when something is missing.
# Output is captured by Claude Code as session context — keep it terse.
set -euo pipefail

REPO_ROOT="${1:-.}"
LINK_FILE="$REPO_ROOT/.claude/kb-link.json"
LOCAL_FILE="$REPO_ROOT/.claude/kb-link.local.json"

read_json_string() {
  # Portable-ish string extraction for {"key":"value"} JSON without requiring jq.
  # Not a general JSON parser — good enough for the flat files this hook reads.
  local file="$1" key="$2"
  grep -o "\"$key\"[[:space:]]*:[[:space:]]*\"[^\"]*\"" "$file" 2>/dev/null \
    | sed -E 's/.*"([^"]+)"$/\1/' \
    | head -n 1
}

if [ ! -f "$LINK_FILE" ]; then
  echo "No Knowledge Base linked to this prototype yet."
  echo "Suggest to the user: run the repo-init skill before starting task work."
  exit 0
fi

KB_URL="$(read_json_string "$LINK_FILE" kb_repo_url)"
echo "Knowledge Base linked: ${KB_URL:-<unreadable>}"

if [ ! -f "$LOCAL_FILE" ]; then
  echo "Personal setup not done on this machine yet."
  echo "Suggest to the user: run the repo-init skill — it will jump to the personal-setup step (step 6)."
fi
