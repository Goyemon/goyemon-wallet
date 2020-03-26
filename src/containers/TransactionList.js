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
	}

	updateTxListState() {
		LogUtilities.toDebugScreen('TransactionList updateTxListState() called');
		//if (this.props.tokenFilter && this.props.tokenFilter == 'Dai')

		this.setState({
			transactions: this.uniqcounter++,
			transactionsLoaded: true
		});
	}

	getItem(data, index) {
		return {
			getFrom: () => { return index; },
			getNonce: () => { return '_nah'; },
			filter: this.props.tokenFilter ? this.props.tokenFilter.toLowerCase() : 'all'
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
					renderItem={({ item }) => <Transaction transaction={item} />}
					keyExtractor={item => `${item.getFrom()}${item.getNonce()}`}
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
