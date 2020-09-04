"use strict";
import messaging from "@react-native-firebase/messaging";
import { saveNotificationPermission } from "../actions/ActionPermissions";
import { store } from "../store/store";
import LogUtilities from "../utilities/LogUtilities.js";

class FcmPermissions {
  async checkFcmPermissions() {
    const authorizationStatus = await messaging().hasPermission();
    if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
      LogUtilities.logInfo("user has permissions");
      store.dispatch(saveNotificationPermission(true));
    } else {
      LogUtilities.logInfo("user does not have permission");
      try {
        await messaging().requestPermission();
        const authorizationStatus = await messaging().hasPermission();
        if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
          store.dispatch(saveNotificationPermission(true));
          LogUtilities.logInfo("User has authorised");
        } else {
          store.dispatch(saveNotificationPermission(false));
        }
      } catch (error) {
        LogUtilities.logInfo("User has rejected permissions");
        store.dispatch(saveNotificationPermission(false));
      }
    }
  }
}

export default new FcmPermissions();
