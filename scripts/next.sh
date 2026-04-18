#!/usr/bin/env bash

set -euo pipefail

export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
unset PREFIX
unset NPM_CONFIG_PREFIX
unset npm_config_prefix

if [ -s "$NVM_DIR/nvm.sh" ]; then
  . "$NVM_DIR/nvm.sh"
fi

if command -v nvm >/dev/null 2>&1; then
  nvm use 20.20.1 >/dev/null
  unset npm_node_execpath
  unset npm_execpath
  exec "$NVM_BIN/node" ./node_modules/next/dist/bin/next "$@"
fi

node ./node_modules/next/dist/bin/next "$@"
