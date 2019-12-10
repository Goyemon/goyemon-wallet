'use strict';
import Web3 from 'web3';


class GasUtilities {
  getTransactionFeeEstimateInEther(gasPriceInWei, gasLimit) {
    const transactionFeeEstimateInWei = parseFloat(gasPriceInWei) * gasLimit;
    const transactionFeeEstimateInEther = Web3.utils.fromWei(
      transactionFeeEstimateInWei.toString(),
      'Ether'
    );
    return transactionFeeEstimateInEther;
  }
}

export default new GasUtilities();
