#!/usr/bin/env bash

echo "clean dist folder"
rm -rf .dist
echo "begin to build"
vue-cli-service build
echo "copy .spa file"
cp ./src/assets/.spa ./dist/
