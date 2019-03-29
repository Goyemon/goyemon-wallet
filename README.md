<h1 align="center"> Stable Wallet </h1> <br>
<p align="center">
  <a href="#"><img src="./assets/sample_img2.jpg" width="200"></a>
</p>

<p align="center">
  Dai wallet in your pocket. Built with React Native.
</p>

<p align="center">
  <a href="https://itunes.apple.com/us/app/gitpoint/id1251245162?mt=8">
    <img alt="Download on the App Store" title="App Store" src="./assets/appstore_logo.png" width="140">
  </a>

  <a href="https://play.google.com/store/apps/details?id=com.gitpoint">
    <img alt="Get it on Google Play" title="Google Play" src="./assets/Download_on_GooglePlay.png" width="140">
  </a>
</p>

## Table of Contents

- [Features](#features)
- [For Users](#users)
- [For Developers](#developers)
- [How To Build](#how-to-build)
- [Help](#help)
- [License](#license)

[![Build Status](https://img.shields.io/travis/gitpoint/git-point.svg?style=flat-square)](https://travis-ci.org/gitpoint/git-point)
[![Coveralls](https://img.shields.io/coveralls/github/gitpoint/git-point.svg?style=flat-square)](https://coveralls.io/github/gitpoint/git-point)
[![All Contributors](https://img.shields.io/badge/all_contributors-73-orange.svg?style=flat-square)](./CONTRIBUTORS.md)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square)](http://commitizen.github.io/cz-cli/)

![screenshot](./assets/sample_img.png 'Screenshot')

## Features

- Control Your Keys
  - keys are stored locally, on your device
- Make a Loan
  - Lock your ether and get dai.
- Pay Back a Loan
  - Pay back your dai and get your ether back.

![screenshot](./assets/sample_img.png 'Screenshot')

## For Users

## For Developers

## How To Build

To clone and run this application, you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository
$ git clone https://github.com/TaiMino/DeBank.git

# Go into the repository
$ cd DeBank

# Install dependencies
$ npm install

$ react-native link react-native-randombytes
$ react-native link react-native-keychain

$ npm run postinstall

# Run the app
$ react-native run-android or react-native run-ios
```

_you should see the shim.js in a home directory
The thing is, there are nodeJS core modules that cannot be used in React Native, and thus you have to use some hacks: you use rn-nodeify module to use nodeJS core modules._

Note: If you're using Linux Bash for Windows, [see this guide](https://www.howtogeek.com/261575/how-to-run-graphical-linux-desktop-applications-from-windows-10s-bash-shell/) or use `node` from the command prompt.

## Help

## License

MIT

---
