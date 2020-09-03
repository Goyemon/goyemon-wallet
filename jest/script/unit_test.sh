#!/bin/sh

echo "Install Dependencies"
npm i

echo "Copy Json Config File"
cp jest/config/config.json.test src/config.json
cp jest/config/en.json.test src/i18n/en.json
cp jest/sample/store.js src/store/store.ts

echo "Unit Test"
npm run test
