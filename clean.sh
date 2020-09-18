#!/bin/sh

if [ $# == "android" ]; then
    rm -rf node_modules ios/Pods
    (npm i && cd android && ./gradlew clean)
    npm run $#
else
    rm -rf node_modules ios/Pods
    (npm i && cd ios && pod install)
    npm run ios
fi
