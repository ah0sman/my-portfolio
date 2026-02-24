#!/bin/bash
set -euo pipefail

# Only run in remote (web) environment
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

# Install npm dependencies
# npm install is idempotent and uses the package-lock.json for consistency
npm install
