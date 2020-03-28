'use strict';
import React, { Component } from 'react';
import { View, VirtualizedList } from 'react-native';
import styled from 'styled-components/native';
import Transaction from './Transaction';
import LogUtilities from '../utilities/LogUtilities';

import TxStorage from '../lib/tx.js';

class TransactionList extends Component {
	constructor(props) {
		super(props);

		this.state = {
			'transactions': null,
			'transactionsLoaded': false
		}
		this.uniqcounter = 0;
		// this.refreshIndices = {};
	}

	updateTxListState(idx) {
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
			filter: this.props.tokenFilter ? this.props.tokenFilter.toLowerCase() : 'all',
			// ...refreshData
		};
	}
	getItemCount(data) {
		return TxStorage.storage.getTxCount(this.props.tokenFilter ? this.props.tokenFilter.toLowerCase() : 'all');
		// this.props here seems not available. hm.
		// this.props.tokenFilter ? this.props.tokenFilter.toLowerCase() : 'all'
	}

	// renderSingleTx(tx) {
	// 	if (tx instanceof TxStorage.Tx)
	// 		return <Transaction transaction={tx} />;

	// 	return <EmptyTransactionText>Loadink...</EmptyTransactionText>;
	// }

	renderTransactions() {
		LogUtilities.toDebugScreen('TransactionList renderTransactions() called');
		if (this.state.transactionsLoaded) {
			if (this.getItemCount() == 0)
				return (
					<EmptyTransactionContainer>
						<EmptyTransactionEmoji>(°△°) b</EmptyTransactionEmoji>
						<EmptyTransactionText>holy tabula rasa!</EmptyTransactionText>
						<EmptyTransactionText> you don’t have any transactions yet!</EmptyTransactionText>
					</EmptyTransactionContainer>
				);

			return (
				<VirtualizedList
					initialNumToRender={32}
					maxToRenderPerBatch={32}
					data={'yes'}
					getItem={this.getItem.bind(this)}
					getItemCount={this.getItemCount.bind(this)}
					renderItem={({ item }) => <Transaction transaction={item} updateCounter={this.state.transactions_update_counter} />}
					keyExtractor={item => item.index.toString()}
				/>
			);
		}
		else {
			return (
				<EmptyTransactionContainer>
					<EmptyTransactionText>Loadink...</EmptyTransactionText>
					<EmptyTransactionEmoji>(ノ°Д°）ノ︵ ┻━┻</EmptyTransactionEmoji>
				</EmptyTransactionContainer>
			);
		}
	}

	render() {
		return <HistoryContainer>{this.renderTransactions()}</HistoryContainer>;
	}

	componentDidMount() {
		LogUtilities.toDebugScreen('TransactionList componentDidMount() called');
		// this.__mounted = true;
		this.unsub = TxStorage.storage.subscribe(this.updateTxListState.bind(this));
		(async () => { this.updateTxListState() })();
	}

	componentWillUnmount() {
		LogUtilities.toDebugScreen('TransactionList componentWillUnmount() called');
		// this.__mounted = false;
		this.unsub();
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
