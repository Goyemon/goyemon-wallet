<h1 align="center"> Swarm </h1> <br>
<p align="center">
  <a href="#"><img src="./assets/sample_img2.jpg" width="200"></a>
</p>

<p align="center">
  Swarm is a frictionless bank that allows users to borrow, lend and save money only with a few taps of a button.
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
- [Security](#users)
- [For Developers](#developers)
- [Help](#help)
- [License](#license)

[![Build Status](https://img.shields.io/travis/gitpoint/git-point.svg?style=flat-square)](https://travis-ci.org/gitpoint/git-point)
[![Coveralls](https://img.shields.io/coveralls/github/gitpoint/git-point.svg?style=flat-square)](https://coveralls.io/github/gitpoint/git-point)
[![All Contributors](https://img.shields.io/badge/all_contributors-73-orange.svg?style=flat-square)](./CONTRIBUTORS.md)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square)](http://commitizen.github.io/cz-cli/)

![screenshot](./assets/sample_img.png 'Screenshot')

## Features

- Pay
  - Spend your Dai and Ether to purchase something.

- Save
  - Lock your Dai to gain interests. Think of it as the permisionless version of a saving account in a bank.

- Borrow
  - Lock your Eth to borrow Dai.

- Invest
  - Do the leverage trading by locking Eth, issuing Dai, exchanging Dai with Eth and then locking Eth again.

- Exchange
  - Exchange any Eth and Erc20 tokens.

![screenshot](./assets/sample_img.png 'Screenshot')

## Security
- Control Your Keys
  - keys are stored locally, on your device

## For Developers
To run this application, you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository
$ git clone https://github.com/taisukemino/DeBank.git

# Go into the repository
$ cd DeBank

# Install dependencies
$ npm install

# link npm packages
$ react-native link

# install node core modules
$ npm run postinstall

# pod install
$ cd ios
$ pod install

# Run the app in iOS
$ npm run ios

# Run the app in android
$ npm run android

Contact me if the build fails. I might be able to help you.
```

_you should see the shim.js in a home directory.
nodeJS core modules cannot be used in React Native, and thus you have to use some hacks: you use rn-nodeify module to use nodeJS core modules._

Note: If you're using Linux Bash for Windows, [see this guide](https://www.howtogeek.com/261575/how-to-run-graphical-linux-desktop-applications-from-windows-10s-bash-shell/) or use `node` from the command prompt.

## Help

## License

MIT

---
