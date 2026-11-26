#!/bin/bash

HTML_DIRECTORIES=( "docs/" ".svelte-kit/output/prerendered/pages/" )
STATICRYPT_TEMPLATE="scripts/staticrypt_template.html"

npm run build-raw

for directory in "${HTML_DIRECTORIES[@]}"
do
    echo "Encrypt HTML files in \"$directory\""
    parent="$(dirname "${directory}")"
    npx staticrypt "$directory" -r -d "$parent" -t "$STATICRYPT_TEMPLATE"
done
