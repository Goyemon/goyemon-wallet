'use strict';
import ProviderController from './ProviderController.ts';

class TransactionController {
  private web3 = ProviderController.setProvider();

  parseTransactions(transactions) {
    const parsedTransactions = transactions.map((transaction) => {
      return {
        id: "",
        hash: transaction.hash,
        from: transaction.from,
        to: transaction.to,
        gas: transaction.gas,
        gasPrice: transaction.gasPrice,
        value: this.parseTransactionValue(transaction.value),
        time: this.parseTransactionTime(transaction.time),
        nonce: "",
        status: ""
      }
    })
    return parsedTransactions;
  }

  parseTransaction(transactionObject) {
    const parsedTransaction = {
      id: "",
      hash: transactionObject.hash,
      from: transactionObject.from,
      to: transactionObject.to,
      gas: transactionObject.gas,
      gasPrice: transactionObject.gasPrice,
      value: this.parseTransactionValue((transactionObject.value)),
      time: "",
      nonce: transactionObject.nonce,
      status: ""
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
