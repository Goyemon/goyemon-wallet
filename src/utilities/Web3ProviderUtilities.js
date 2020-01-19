'use strict';
import Web3 from 'web3';

class Web3ProviderUtilities {
  web3Provider() {
    const infuraId = '884958b4538343aaa814e3a32718ce91';
    const web3 = new Web3(
      new Web3.providers.HttpProvider(`https://ropsten.infura.io/v3/${this.infuraId}`)
    );
    return web3;
  }
}

export default new Web3ProviderUtilities();
