#!/usr/bin/env bash

set -e

build() {
	rm -rf build/
	babel -d ./build ./src --copy-files
}

# Install dependencies
if [ ! -d "node_modules" ]; then
	yarn
fi

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