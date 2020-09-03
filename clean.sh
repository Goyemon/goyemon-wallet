#!/bin/sh

rm -rf node_modules ios/Pods
(cd android && ./gradlew clean)
(npm i && cd ios && pod install)
npm run android
