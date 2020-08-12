#!/bin/sh

echo "Copy Json Config File"
cp jest/config/config.json.test src/config.json
cp jest/config/en.json.test src/i18n/en.json

echo "Unit Test"
npm run test
