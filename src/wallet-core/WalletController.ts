'use strict';
import * as Keychain from 'react-native-keychain';
import bip39 from 'react-native-bip39';
import hdkey from 'ethereumjs-wallet/hdkey';
const Buffer = require('buffer').Buffer;

const KEY_WALLET_MNEMONIC = 'KEY_WALLET_MNEMONIC';
const KEY_WALLET_PRIVATE_KEY = 'KEY_WALLET_PRIVATEKEY';

class WalletController {
  private root;

  public constructor() {
    this.init = this.init.bind(this);
  }

  public async init() {
    let mnemonic = await this.getMnemonic();
    if (!mnemonic || !mnemonic.length || !this.validateMnemonic(mnemonic)) {
      mnemonic = await this.generateMnemonic();
      await this.setMnemonic(mnemonic);
    }

    let seedhex = await bip39.mnemonicToSeedHex(mnemonic);
    let seed = await Buffer.from(seedhex, 'hex');
    this.root = await hdkey.fromMasterSeed(seed);

    return true;
  }

  public async createWallet() {
    const wallet = await this.root.deriveChild().getWallet();
    return wallet;
  }

  public async createPrivateKey(wallet) {
    let privateKey = await wallet.getPrivateKeyString();
    return privateKey;
  }

  public async createChecksumAddress(wallet) {
    let checksumAddress = await wallet.getChecksumAddressString();
    return checksumAddress;
  }

  public async getPrivateKey() {
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
    const result = await Keychain.setGenericPassword('PRIVATEKEY', privateKey, KEY_WALLET_PRIVATE_KEY);
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
