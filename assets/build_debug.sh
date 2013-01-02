#!/bin/bash

echo ""
echo ""
echo "Compiling handlebars"
cd ../../FieldDB
bash scripts/build_templates.sh

echo ""
echo ""
echo "Copying files to android assets"
cd ../AndroidFieldDB/assets
rm -rf release
cp -r ../../FieldDB/couchapp/_attachments release
