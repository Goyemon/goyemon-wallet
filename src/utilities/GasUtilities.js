'use strict';
import Web3 from 'web3';

class GasUtilities {
  getTransactionFeeEstimateInEther(gasPriceWei, gasLimit) {
    const transactionFeeEstimateWei = parseFloat(gasPriceWei) * gasLimit;
    const transactionFeeEstimateInEther = Web3.utils.fromWei(
      transactionFeeEstimateWei.toString(),
      'Ether'
    );
    return transactionFeeEstimateInEther;
  }
}

export default new GasUtilities();
