#!/bin/bash

# request-compose uses language features available in Node >= 8
# request-compose is transpiled to support versions of Node >= 4
# The transpiled version, however, is used only on Node 4 and 6
# Node >= 8 uses the raw source files instead

# prepublish
rm -rf build/ && mkdir build

# fix for Node v4
rm -rf node_modules/core-js
npm i core-js@2.6.10 --no-save

# alias
babel=node_modules/.bin/babel

# transpile
$babel request --out-dir build/request
$babel response --out-dir build/response
$babel utils --out-dir build/utils
$babel test --out-dir build/test
$babel *.js --out-dir build

# copy
cp -r test/ssl/ build/test/
cp -r test/fixtures/ build/test/
