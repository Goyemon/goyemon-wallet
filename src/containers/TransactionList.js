'use strict';
import React, { Component } from 'react';
import { VirtualizedList } from 'react-native';
import styled from 'styled-components/native';
import Transaction from './Transaction';
import I18n from '../i18n/I18n';
import LogUtilities from '../utilities/LogUtilities';
import TransactionUtilities from '../utilities/TransactionUtilities.ts';
import TxStorage from '../lib/tx.js';

class TransactionList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      transactions: null,
      transactionsLoaded: false
    };
    this.uniqcounter = 0;
    // this.refreshIndices = {};

    this.__tempcachecount = 'derp';
  }

  componentDidMount() {
    // this.__mounted = true;
    this.unsub = TxStorage.storage.subscribe(this.updateTxListState.bind(this));
    (async () => {
      this.updateTxListState();
    })();
  }

  componentWillUnmount() {
    this.unsub();
  }

  updateTxListState() {
    LogUtilities.toDebugScreen('TransactionList updateTxListState() called');
    // this.refreshIndices = {0: true,1: true,2: true,3: true,4: true,5: true,6:true,7:true,8:true,9:true};

    this.setState({
      transactions_update_counter: this.uniqcounter++,
      transactionsLoaded: true
    });
  }

  getItem(data, index) {
    // let refreshData = {};
    // if (this.refreshIndices[index]) {
    // 	refreshData.refresh = 1;
    // 	delete this.refreshIndices[index];
    // }

    return {
      index: this.getItemCount() - index - 1, // basically reverse-sort. we want the LATEST index on top, not the earliest.
      filter: TransactionUtilities.getFilter(this.props.tokenFilter.toLowerCase())
      // ...refreshData
    };
  }

  getItemCount() {
    const ret = TxStorage.storage.getTxCount(
      TransactionUtilities.getFilter(this.props.tokenFilter.toLowerCase())
    );
    if (ret != this.__tempcachecount) {
      // prevent flood
      this.__tempcachecount = ret;
    }
    return ret;
  }

  renderTransactions() {
    LogUtilities.toDebugScreen('TransactionList renderTransactions() called');
    if (this.state.transactionsLoaded) {
      if (this.getItemCount() == 0)
        return (
          <EmptyTransactionContainer>
            <EmptyTransactionEmoji>(°△°) b</EmptyTransactionEmoji>
            <EmptyTransactionText>
              {I18n.t('history-empty-tx-msg1')}
            </EmptyTransactionText>
            <EmptyTransactionText>
              {I18n.t('history-empty-tx-msg2')}
            </EmptyTransactionText>
          </EmptyTransactionContainer>
        );

      return (
        <VirtualizedList
          initialNumToRender={32}
          maxToRenderPerBatch={32}
          data={'yes'}
          getItem={this.getItem.bind(this)}
          getItemCount={this.getItemCount.bind(this)}
          renderItem={({ item }) => (
            <Transaction
              checksumAddress={this.props.checksumAddress}
              onTxTapped={
                this.props
                  .onTxTapped /* TODO: do i need to do it or does this prop propagate to all the children? */
              }
              transaction={item}
              updateCounter={this.state.transactions_update_counter}
            />
          )}
          keyExtractor={(item) => item.index.toString()}
        />
      );
    } else {
      return (
        <EmptyTransactionContainer>
          <EmptyTransactionText>...</EmptyTransactionText>
          <EmptyTransactionEmoji>(ノ°Д°）ノ︵ ┻━┻</EmptyTransactionEmoji>
        </EmptyTransactionContainer>
      );
    }
  }

  render() {
    return <HistoryContainer>{this.renderTransactions()}</HistoryContainer>;
  }
}

const HistoryContainer = styled.View`
  background: #f8f8f8;
  height: 100%;
`;

const EmptyTransactionContainer = styled.View`
  align-items: center;
  flex-direction: column;
  justify-content: center;
  margin-top: 120px;
`;

const EmptyTransactionEmoji = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  font-size: 40;
  margin-bottom: 24;
`;

const EmptyTransactionText = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  font-size: 16;
`;

export default TransactionList;
