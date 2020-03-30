<h1 align="center">Goyemon</h1>
<p align="center">
  <a href="#"><img src="./assets/sample_img2.jpg" width="200"></a>
</p>
<h2 align="center">Sharing Economy for Crypto Assets<h2>
<h3 align="center">
  earn interests by sharing your unused crypto assets
</h3>

<p align="center">
  <a href="https://itunes.apple.com/us/app/gitpoint/id1251245162?mt=8">
    <img alt="Download on the App Store" title="App Store" src="./assets/appstore_logo.png" width="140">
  </a>
  <a href="https://play.google.com/store/apps/details?id=com.gitpoint">
    <img alt="Get it on Google Play" title="Google Play" src="./assets/Download_on_GooglePlay.png" width="140">
  </a>
</p>

## For Developers

To run this application, you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer.

I am using:

```
$ python --version
Python 3.7.0
$ node --version
v11.6.0
$ ruby --version
ruby 2.6.0p0 (2018-12-25 revision 66547) [x86_64-darwin17]
$ pod --version
1.7.2
```

macOS Mojave 10.14.6
Xcode 11.0

From your command line:

```bash
# Clone this repository
$ git clone https://github.com/taisukemino/Goyemon.git

# Go into the repository
$ cd Goyemon

# Install dependencies
$ npm install

# install node core modules
$ npm run postinstall

# pod install
$ cd ios
$ pod install

# Run the app in iOS
$ npm run ios
$ npm run start

# Run the app in android
$ npm run android
$ npm run start

Contact me if the build fails. I might be able to help you.
```

_you should see the shim.js in a home directory.
nodeJS core modules cannot be used in React Native, and thus you have to use some hacks: you use rn-nodeify module to use nodeJS core modules._

Note: If you're using Linux Bash for Windows, [see this guide](https://www.howtogeek.com/261575/how-to-run-graphical-linux-desktop-applications-from-windows-10s-bash-shell/) or use `node` from the command prompt.

## Help

## License

MIT

---
