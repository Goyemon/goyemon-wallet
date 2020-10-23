## How to Build and Run

Requirements:

- [Git](https://git-scm.com)
- [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com))
- [XCode](https://developer.apple.com/xcode/)
- [CocoaPods](https://cocoapods.org/)

```bash
# clone this repository
$ git clone https://github.com/Goyemon/goyemon-wallet.git

# checkout to the develop branch
$ cd goyemon-wallet && git checkout develop

# install dependencies
$ npm install

# install node core modules
// NodeJS core modules usually cannot be used in React Native. We use some hacks with the [rn-nodeify](https://github.com/tradle/rn-nodeify).
$ npm run postinstall
// you should see the shim.js in the home directory.

# install pods
$ cd ios && pod install

# run the app in iOS
$ npm run ios
$ npm run start

# run the app in android
$ npm run android
$ npm run start

```

## Networks

We use the Mainnet in the master and the Ropsten in the develop(and other feature branches). You can switch between networks in your local. But they should NOT be changed in remote branches.

## Addresses for Testing

We have several addresses for testing both in the Ropsten and Mainnet. It is not encouraged to use the same address simultaneously with other developers when you test outgoing transactions. Otherwise, you will mess up an account nonce and get the "nonce too low" error from geth. 

## Config Files

We have three config files:

- `goyemon-wallet/src/config.json`
- `goyemon-wallet/ios/GoogleService-Info.plist`
- `goyemon-wallet/android/app/google-services.json`

In the master, these config files have values for the Mainnet. In the develop(and other feature branches), these config files have values for the Ropsten.

These config files usually should NOT be changed. If you do, you need to be EXTRA careful when you merge the develop into the master.

## Debuggers

You can see all the communication logs between the wallet and an fcm server.

- [Ropsten](http://[240d:1a:2a:1000:8e70:5aff:febd:4328]:31337/devs/)
- [Mainnet](http://51.89.42.181:31337/devs/)

You can also send dummy messages to the wallet from [here](http://51.89.42.181:31330/debugmsgs).

Specify an address, type and json data. All the devices registered with a passed address will get the dummy data. If you prefer the command line, use `curl`.

## Version Info

I am using:

```
$ python --version
Python 3.7.0
$ node --version
v12.0.0
$ npm --version
6.14.0
$ ruby --version
ruby 2.6.0p0 (2018-12-25 revision 66547) [x86_64-darwin17]
$ pod --version
1.9.3
$ fastlane --version
fastlane 2.164.0
```

macOS Catalina 10.15.6
Xcode 12.0.0
_Xcode 12.0.1 caused a problem in fastlane._ 

## License

MIT

---
