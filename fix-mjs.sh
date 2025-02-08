runIt() {
  for file in ./dist/esm/*.js; do
    echo "Updating $file contents..."
    sed -i '' "s/\.js'/\.mjs'/g" "$file"
    echo "Renaming $file to ${file%.js}.mjs..."
    mv "$file" "${file%.js}.mjs"
  done
}
find ./dist/esm -name '*.js' -exec sh -c 'mv "$1" "${1%.js}.mjs"' _ {} \;
