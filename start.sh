#!/usr/bin/env bash

set -e

build() {
	rm -rf build/
	babel -d ./build ./src --copy-files
}

# Install dependencies
if [ ! -d "node_modules" ]; then
	if command -v yarn > /dev/null; then
    yarn
  else
    npm i
  fi
fi

if command -v sha1sum > /dev/null; then
  # Sha1sum is available
  # Use it to prevent useless compilations

  touch .old_hash
  old_hash=`cat .old_hash`
  new_hash=`find src -type f | xargs sha1sum | sha1sum`

  # Rebuild if there's a change
  if [ "$old_hash" != "$new_hash" ]; then
	  build
	  echo "$new_hash" > .old_hash
  else
	  echo "No changes. No rebuild needed"
  fi
else
  echo "[!] ----- [!]"
  echo "sha1sum command not available"
  echo "This will trigger a compilation"
  echo "[!] ----- [!]"
  build
fi
