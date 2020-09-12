import AsyncStorage from "@react-native-community/async-storage";

export function logCurrentStorage() {
  AsyncStorage.getAllKeys().then((keyArray) => {
    AsyncStorage.multiGet(keyArray).then((keyValArray) => {
      const myStorage: any = {};
      for (const keyVal of keyValArray) {
        myStorage[keyVal[0]] = keyVal[1];
      }

      console.log("CURRENT STORAGE: ", myStorage);
    });
  });
}
