#!/bin/sh
# Pin Node 22 for the dev server AND any child workers Turbopack spawns
# (PostCSS/loader workers resolve `node` from PATH, not the parent's binary).
export PATH="/Users/mariociambelli/.nvm/versions/node/v22.11.0/bin:$PATH"
exec node node_modules/next/dist/bin/next dev "$@"
