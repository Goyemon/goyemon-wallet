"use strict";
const Buffer = require("buffer").Buffer;
const hdkey = require("ethereumjs-wallet/hdkey");
const bip39 = require("react-native-bip39");
import * as Keychain from "react-native-keychain";
import EtherUtilities from "./EtherUtilities";

const KEY_WALLET_MNEMONIC = "KEY_WALLET_MNEMONIC";
const KEY_WALLET_PRIVATE_KEY = "KEY_WALLET_PRIVATEKEY";

class WalletUtilities {
  private root: any;
  private wallet: any;
  private mnemonic: any;

  public constructor() {
    this.init = this.init.bind(this);
  }

  public async init() {
    this.mnemonic = await this.generateMnemonic();
    await this.setMnemonic(this.mnemonic);
    return this.mnemonic;
  }

  private async generateMnemonic() {
    let mnemonic = await bip39.generateMnemonic(256);
    while (true) {
      const words = mnemonic.split(" ");
      const uniqueWords = words.filter(
        (word: any, index: any) => words.indexOf(word) == index
      );
      if (words.length == uniqueWords.length) {
        break;
      } else {
        mnemonic = await bip39.generateMnemonic(256);
        break;
      }
    }
    return mnemonic;
  }

  private async setMnemonic(mnemonic: any) {
    const isGenericPasswordSet = await Keychain.setGenericPassword(
      "MNEMONIC",
      mnemonic,
      KEY_WALLET_MNEMONIC
    );
    return isGenericPasswordSet;
  }

  public async getMnemonic() {
    try {
      const result = await Keychain.getGenericPassword(KEY_WALLET_MNEMONIC);
      if (typeof result === "boolean") {
        return "";
      } else {
        return result.password;
      }
    } catch (error) {
      return "";
    }
  }

  private validateMnemonic(mnemonic: any) {
    if (!bip39.validateMnemonic(mnemonic)) {
      return false;
    }
    const words = mnemonic.split(" ");
    const uniqueWords = words.filter(
      (word: any, index: any) => words.indexOf(word) == index
    );
    return words.length === uniqueWords.length;
  }

  public async generateWallet(mnemonic: any) {
    const seedhex = bip39.mnemonicToSeedHex(mnemonic);
    const seed = Buffer.from(seedhex, "hex");
    this.root = hdkey.fromMasterSeed(seed);
    this.wallet = this.root.derivePath("m/44'/60'/0'/0/0").getWallet();

    return true;
  }

  public async createPrivateKey() {
    let privateKey = await this.getPrivateKey();
    if (!privateKey) {
      privateKey = await this.wallet.getPrivateKey();
      privateKey = EtherUtilities.hexArrayToString(privateKey);
    }
    return privateKey;
  }

  private async setPrivateKey(privateKey: any) {
    const res = await this.getPrivateKey();
    return res
      ? res
      : await Keychain.setGenericPassword(
          "PRIVATEKEY",
          privateKey,
          KEY_WALLET_PRIVATE_KEY
        );
  }

  public async getPrivateKey() {
    try {
      const result = await Keychain.getGenericPassword(KEY_WALLET_PRIVATE_KEY);
      if (typeof result === "boolean") {
        return "";
      } else {
        return result.password;
      }
    } catch (err) {
      return "";
    }
  }

  async isPrivateKeySaved() {
    const privateKey = await this.getPrivateKey();
    if (privateKey === "") {
      return false;
    } else {
      return true;
    }
  }

  public async createChecksumAddress() {
    const checksumAddress = await this.wallet.getChecksumAddressString();
    return checksumAddress;
  }

  async resetKeychainData() {
    await Keychain.resetGenericPassword(KEY_WALLET_MNEMONIC);
    await Keychain.resetGenericPassword(KEY_WALLET_PRIVATE_KEY);
  }
}

export default new WalletUtilities();
