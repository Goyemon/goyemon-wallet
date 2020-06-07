<h1 align="center">Goyemon</h1>
<h2 align="center">a new generation bank at your fingertips<h2>

## How to Build and Run the Application

You'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer.

From your command line:

```bash
# clone this repository
$ git clone https://github.com/taisukemino/Goyemon.git

# checkout to the develop branch
$ cd Goyemon && git checkout develop

# in the repository, install dependencies
$ npm install

# install node core modules
$ npm run postinstall

# pod install
$ cd ios && pod install

# run the app in iOS
$ npm run ios
$ npm run start

# run the app in android
$ npm run android
$ npm run start

```

_you should see the shim.js in a home directory.
nodeJS core modules cannot be used in React Native, and thus you have to use some hacks: we use rn-nodeify module to use nodeJS core modules._

We also added a method in the npm module. In `react-native-firebase/dist/modules/messaging/index.js`, add the method below the constructor:
```js
  stupid_shit_initialized() {
    if (Platform.OS === 'ios') {
      getNativeModule(this).jsInitialised();
    }
  }
```



Contact somebody in our team if the build fails.

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

macOS Mojave 10.14.6
Xcode 11.3.1

## License

MIT

---
