'use strict';
import * as Keychain from 'react-native-keychain';
import bip39 from 'react-native-bip39';
import hdkey from 'ethereumjs-wallet/hdkey';
const Buffer = require('buffer').Buffer;
import EthUtils from './EthUtils.js';

const KEY_WALLET_MNEMONIC = 'KEY_WALLET_MNEMONIC';
const KEY_WALLET_PRIVATE_KEY = 'KEY_WALLET_PRIVATEKEY';

class WalletController {
  private root;
  private wallet;

  public constructor() {
    this.init = this.init.bind(this);
  }

  public async init() {
    let mnemonic = await this.getMnemonic();
    if (!mnemonic || !mnemonic.length || !this.validateMnemonic(mnemonic)) {
      mnemonic = await this.generateMnemonic();
      await this.setMnemonic(mnemonic);
    }

  public async generateWallet(mnemonic) {
    let seedhex = bip39.mnemonicToSeedHex(mnemonic);
    let seed = Buffer.from(seedhex, 'hex');
    this.root = hdkey.fromMasterSeed(seed);
    this.wallet = this.root.deriveChild().getWallet();

    return true;
  }

  public async createPrivateKey() {
    let privateKey = await this.retrievePrivateKey();
    if (!privateKey) {
      privateKey = await this.wallet.getPrivateKey();
      privateKey = EthUtils.hexArrayToString(privateKey);
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
      if (typeof result === 'boolean') {
        return '';
      } else {
        return result.password;
      }
    } catch (err) {
      return '';
    }
  }

  private async setPrivateKey(privateKey) {
    const result = await this.retrievePrivateKey();
    if(!result) {
      const result = await Keychain.setGenericPassword('PRIVATEKEY', privateKey, KEY_WALLET_PRIVATE_KEY);
    }
    return result;
  }

  private async generateMnemonic() {
    let mnemonic = await bip39.generateMnemonic(256);
    while (true) {
      const words = mnemonic.split(' ');
      const uniqueWords = words.filter((word, index) => words.indexOf(word) == index);
      if (words.length == uniqueWords.length) {
        break;
      } else {
        let mnemonic = await bip39.generateMnemonic(256);
      }
    }
    return mnemonic;
  }

  private validateMnemonic(mnemonic) {
    if (!bip39.validateMnemonic(mnemonic)) {
      return false;
    }
    const words = mnemonic.split(' ');
    const uniqueWords = words.filter((word, index) => words.indexOf(word) == index);
    return words.length === uniqueWords.length;
  }

  public async getMnemonic() {
    try {
      const result = await Keychain.getGenericPassword(KEY_WALLET_MNEMONIC);
      if (typeof result === 'boolean') {
        return '';
      } else {
        return result.password;
      }
    } catch (err) {
      return '';
    }
  }

  private async setMnemonic(mnemonic) {
    const result = await Keychain.setGenericPassword('MNEMONIC', mnemonic, KEY_WALLET_MNEMONIC);
    return result;
  }
}

export default new WalletController();
