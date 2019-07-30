'use strict';
import ProviderController from './ProviderController.ts';

class TransactionController {
  private web3 = ProviderController.setProvider();

  parseTransactions(transactions) {
    const parsedTransactions = transactions.map((transaction) => {
      return {
        hash: transaction.hash,
        to: transaction.to,
        gas: transaction.gas,
        gasPrice: transaction.gasPrice,
        value: this.parseTransactionValue(transaction.value),
        time: this.parseTransactionTime(transaction.time),
        nonce: "",
        state: ""
      }
    })
    return parsedTransactions;
  }

  parsePendingTransaction(transactionObject) {
    const parsedTransaction = {
      hash: transactionObject.txhash,
      from: transactionObject.txfrom,
      to: transactionObject.txto,
      gasLimit: transactionObject.gas,
      gasPrice: transactionObject.gasPrice,
      value: this.parseTransactionValue((transactionObject.value)),
      time: transactionObject.timestamp,
      nonce: transactionObject.nonce,
      state: transactionObject.state
    }

    return parsedTransaction;
  }

  parseTransactionValue(value) {
    const bigNumberValue = this.web3.utils.toBN(value).toString();
    const parsedEtherValue = this.web3.utils.fromWei(bigNumberValue);
    return parsedEtherValue;
  }

  parseTransactionTime(time) {
    const date = new Date(time*1000);
    const hours = date.getHours();
    const minutes = "0" + date.getMinutes();
    const seconds = "0" + date.getSeconds();
    const formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    return formattedTime;
  }

}

export default new TransactionController();
