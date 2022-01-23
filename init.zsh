#!/usr/bin/env zsh
#
# Game of Life
#
# Following along with the Rust and WebAssembly book:
# https://rustwasm.github.io/docs/book/game-of-life/setup.html

set -euo pipefail

# Configure Node.js.
export NVM_DIR=~/.nvm
source "$NVM_DIR"/nvm.sh
nvm use --lts   # v16.13.1
npm install npm@latest -g

# Generate the Rust project.  Cargo generate prompts for the project name.
cargo install wasm-pack cargo-generate
cargo generate --git https://github.com/rustwasm/wasm-pack-template \
    <<<wasm-game-of-life

# Build the Rust code.
cd wasm-game-of-life
wasm-pack build

# Generate the JavaScript project.
#
# The wasm-app template was apparently last updated in 2019.  The generated
# code thus uses ancient versions.  The subsequent npm install (below)
# generates various warnings, and even rewrites package-lock.json because the
# format is so old.
npm init -y wasm-app www

# Build the JavaScript project, then fix some of the wasm-app generated crap.
#
# * It generates a new .git dir even if we're already in a Git repo.
# * The audit fix drops us from 19 to 8 high vulnerabilities. :-/
cd www
rm -rf .git
npm install
npm audit fix || true

# Override hello-wasm-pack dependency with local directory.
#
# We read old file contents into shell variables before writing the new
# contents to avoid overwriting data that haven't been read yet.  The sed -i
# ("in place") flag has no portable way to be used on both Linux and macOS.
declare old="$(<package.json)"
jq --from-file ../../add-dependencies.jq <<<"$old" >package.json
old="$(<index.js)"
sed 's/hello-wasm-pack/wasm-game-of-life/' <<<"$old" >index.js
npm install

# Serve the page.
#
# By default, the local server rejects all traffic that's not from localhost.
# We loosen that restriction so that the server can run in a Docker container,
# yet be accessed from a browser on the host machine.
old="$(<package.json)"
sed 's/webpack-dev-server/& --host 0.0.0.0/' <<<"$old" >package.json
npm start
