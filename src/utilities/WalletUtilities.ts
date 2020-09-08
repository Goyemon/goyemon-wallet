"use strict";
const Buffer = require("buffer").Buffer;
const hdkey = require("ethereumjs-wallet/hdkey");
const bip39 = require("react-native-bip39");
import Keychain, { Options } from "react-native-keychain";
import EtherUtilities from "./EtherUtilities";

const KEY_WALLET_MNEMONIC: Options = {};
const KEY_WALLET_PRIVATE_KEY: Options = {};

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

  public async generateWallet(mnemonic: any) {
    const seedhex = bip39.mnemonicToSeedHex(mnemonic);
    const seed = Buffer.from(seedhex, "hex");
    this.root = hdkey.fromMasterSeed(seed);
    this.wallet = this.root.derivePath(`"m/44'/60'/0'/0/0"`).getWallet();

    return true;
  }

  public async createPrivateKey() {
    let privateKey = await this.retrievePrivateKey();
    if (!privateKey) {
      privateKey = await this.wallet.getPrivateKey();
      privateKey = EtherUtilities.hexArrayToString(privateKey);
    }
    return privateKey;
  }

  public async createChecksumAddress() {
    const checksumAddress = await this.wallet.getChecksumAddressString();
    return checksumAddress;
  }

  public async retrievePrivateKey() {
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

  private async setPrivateKey(privateKey: any) {
    const res = await this.retrievePrivateKey();
    return res
      ? res
      : await Keychain.setGenericPassword(
          "PRIVATEKEY",
          privateKey,
          KEY_WALLET_PRIVATE_KEY
        );
  }

  async privateKeySaved() {
    const privateKey = await this.retrievePrivateKey();
    if (privateKey === "") {
      return false;
    } else {
      return true;
    }
  }

  private async generateMnemonic() {
    let finish;
    while (finish) {
      const mnemonic = await bip39.generateMnemonic(256);
      const words = mnemonic.split(" ");
      const uniqueWords = words.filter(
        (word: any, index: any) => words.indexOf(word) == index
      );
      finish = words.length === uniqueWords.length;
      if (finish) {
        return mnemonic;
      }
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

  private async setMnemonic(mnemonic: any) {
    const result = await Keychain.setGenericPassword(
      "MNEMONIC",
      mnemonic,
      KEY_WALLET_MNEMONIC
    );
    return result;
  }

  async resetKeychainData() {
    await Keychain.resetGenericPassword(KEY_WALLET_PRIVATE_KEY);
    await Keychain.resetGenericPassword(KEY_WALLET_MNEMONIC);
  }
}

export default new WalletUtilities();
