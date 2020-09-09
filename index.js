"use strict";
import "./shim";
import "./base64-polyfill";
import { YellowBox } from "react-native";
import firebase from "@react-native-firebase/app";
import "@react-native-firebase/analytics";
import "@react-native-firebase/crashlytics";
import "@react-native-firebase/messaging";
import "react-native-gesture-handler";
import { AppRegistry } from "react-native";
import { persistStore } from "redux-persist";
import { rehydrationComplete } from "./src/actions/ActionRehydration";
import App from "./src/navigators/AppTab";
import { name as appName } from "./app.json";
import FcmListener from "./src/firebase/FcmListener";
import FCM from "./src/lib/fcm";
import { store } from "./src/store/store";
import { storage } from "./src/lib/tx";
import LogUtilities from "./src/utilities/LogUtilities";

// Register background fcm handler
firebase.messaging().setBackgroundMessageHandler(async (downstreamMessage) => {
  LogUtilities.logInfo(
    "downstreamMessage handled in the background ==>",
    downstreamMessage
  );
  FCM.FCMMsgs.setMsgCallback(FcmListener.downstreamMessageHandler); // so now FcmListener is just a callback we attach to FCMMsgs.
  await FCM.downstreamMessageHandler(downstreamMessage, true);
  return Promise.resolve();
});

AppRegistry.registerComponent(appName, () => App);

async function FCMcheckForUpdates() {
  const data = await storage.getVerificationData();
  // LogUtilities.toDebugScreen('verification data:', JSON.stringify(data));
  FCM.FCMMsgs.checkForUpdates(
    storage.getOwnAddress(),
    data.hashes,
    data.count,
    data.offset
  );
}

storage.isStorageReady().then(() => {
  LogUtilities.toDebugScreen("TxStorage ready.");
});

FCM.FCMMsgs.setMsgCallback(FcmListener.downstreamMessageHandler); // so now FcmListener is just a callback we attach to FCMMsgs.
FcmListener.setStoreReadyPromise(
  new Promise((resolve) => {
    persistStore(store, {}, () => {
      LogUtilities.toDebugScreen("Redux-persist ready.");
      store.dispatch(rehydrationComplete(true));

      storage.isStorageReady().then(() => {
        storage.setOwnAddress(
          store.getState().ReducerChecksumAddress.checksumAddress
        );
        resolve();
        setTimeout(() => FCMcheckForUpdates(), 0);
      });
    });
  })
);
FCM.registerHandler(); // Then we call FCM.registerHandler() to actually initialize FCM.

// Ignore log notification by message:
YellowBox.ignoreWarnings(["Remote debugger", "Require cycle"]);

// Ignore all log notifications:
// console.disableYellowBox = true;
