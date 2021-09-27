#!/bin/bash

P=$(dirname "$0")
FILE=$P/../dist/src/bin.js
chmod +777 "$FILE"
echo "$(printf '#!/bin/node\n\nrequire("module-alias/register");\n\n' | cat - $FILE)" > "$FILE"
