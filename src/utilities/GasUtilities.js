import ProviderUtilities from './ProviderUtilities.ts';

const web3 = ProviderUtilities.setProvider();

class GasUtilities {
  getTransactionFeeEstimateInEther(gasPriceInWei, gasLimit) {
    const transactionFeeEstimateInWei = parseFloat(gasPriceInWei) * gasLimit;
    const transactionFeeEstimateInEther = web3.utils.fromWei(
      transactionFeeEstimateInWei.toString(),
      'Ether'
    );
    return transactionFeeEstimateInEther;
  }
}

export default new GasUtilities();
