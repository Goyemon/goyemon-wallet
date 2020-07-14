<h1 align="center">Goyemon</h1>
<h2 align="center">a new generation bank at your fingertips<h2>

## How to Build and Run the Application

You'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer.

From your command line:

```bash
# clone this repository
$ git clone https://github.com/Goyemon/Goyemon.git

# checkout to the develop branch
$ cd Goyemon && git checkout develop

# in the repository, install dependencies
$ npm install

# install node core modules
$ npm run postinstall
// you should see the shim.js in a home directory.
nodeJS core modules cannot be used in React Native, and thus you have to use some hacks: we use rn-nodeify module to use nodeJS core modules.

# pod install
$ cd ios && pod install

# run the app in iOS
$ npm run ios
$ npm run start

# run the app in android
$ npm run android
$ npm run start

```

We also added a method in the npm module. In `react-native-firebase/dist/modules/messaging/index.js`, add the method below the constructor:
```js
  stupid_shit_initialized() {
    if (Platform.OS === 'ios') {
      getNativeModule(this).jsInitialised();
    }
  }
```
_we could remove this method when we migrate to the new version of firebase._

Contact somebody in our team if the build fails.

## Networks
We use the Mainnet in the master and the Ropsten in the develop(and other feature branches). You can switch between networks in your local but they should not be changed in remote branches. 

## Addresses for Testing
We have several addresses for testing both in the Ropsten and Mainnet. Make sure that you are not using the same address with other developers when you test outgoing transactions. Otherwise, you will get the "nonce too low" error from geth. 

## Config Files
We have three config files:
- `Goyemon/ios/GoogleService-Info.plist`
- `Goyemon/android/app/google-services.json`
- `Goyemon/src/config.json`

In the master, these config files have values for the Mainnet. In the develop(and other feature branches), these config files have values for the Ropsten.

These config files usually should NOT be changed. If you do, you need to be EXTRA careful when you merge the develop into the master. 


## Debuggers
You can see communication logs between the wallet and a server.
- [Ropsten](http://192.168.1.3:31337/devs/)
- [Mainnet](http://51.89.42.181:31337/devs/)

You can also send dummy messages to the wallet from [here](http://51.89.42.181:31330/debugmsgs).

Specify an address, type and json data. All the devices registered with a passed address will get the dummy data. If you prefer the command line, use `curl`. 


## Version Info

I am using:
```
$ python --version
Python 3.7.0
$ node --version
v11.6.0
$ npm --version
6.14.0
$ ruby --version
ruby 2.6.0p0 (2018-12-25 revision 66547) [x86_64-darwin17]
$ pod --version
1.9.1
```

macOS Catalina 10.15.5
Xcode 11.3.1

## License

MIT

---
