#!/usr/bin/env bash

echo "begin to build"
vue-cli-service build
echo "copy .spa file"
cp ./src/assets/.spa ./dist/
