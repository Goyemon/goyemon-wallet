'use strict';
import React, { Component } from 'react';
import { View, VirtualizedList } from 'react-native';
import styled from 'styled-components/native';
import Transaction from './Transaction';

import TxStorage from '../lib/tx.js';

class TransactionList extends Component {
	constructor(props) {
		super(props);

		TxStorage.storage.__addDebug('constructor tokenFilter: ' + props.tokenFilter);

		this.state = {
			'transactions': null,
			'transactionsLoaded': false
		}

		TxStorage.storage.tempGetAllAsList().then(this.updateTxListState.bind(this)); // initial load
	}

	subNewTransactions(txes) { // temporary just because too lazy to change the behaviour in tx.js. for now it calls this method after sub.
		this.updateTxListState(txes);
	}

	updateTxListState(txes) {
		let transactionlist;

		TxStorage.storage.__addDebug('tokenFilter: ' + this.props.tokenFilter);

		if (this.props.tokenFilter && this.props.tokenFilter == 'Dai')
			transactionlist = txes ? txes.filter(tx => {
				if (tx.hasTokenOperations('dai'))
					return true;

				if (tx.hasTokenOperations('cdai'))
					return tx.hasTokenOperation('cdai', TxStorage.TxTokenOpTypeToName.mint) ||
						tx.hasTokenOperation('cdai', TxStorage.TxTokenOpTypeToName.redeem) ||
						tx.hasTokenOperation('cdai', TxStorage.TxTokenOpTypeToName.failure);
			}) : [];

		else
			transactionlist = txes;

		transactionlist.sort((a, b) => b.getTimestamp() - a.getTimestamp());

		this.setState({
			transactions: transactionlist,
			transactionsLoaded: true
		});
	}

	getItem(data, index) {
		// return empty <Transaction></Transaction> placeholder, but load data in bg that .then()s setState for that <Transaction> (if it's still mounted)
		return data[index];
	}
	getItemCount(data) {
		return data.length;
	}

	renderTransactions() {
		if (this.state.transactionsLoaded) {
			const transactions = this.state.transactions ? this.state.transactions : [];

			if (transactions.length == 0)
				return (
					<EmptyTransactionContainer>
						<EmptyTransactionEmoji>(°△°) b</EmptyTransactionEmoji>
						<EmptyTransactionText>holy tabula rasa!</EmptyTransactionText>
						<EmptyTransactionText> you don’t have any transactions yet!</EmptyTransactionText>
					</EmptyTransactionContainer>
				);

			return (
				<VirtualizedList
					data={transactions}
					getItem={this.getItem}
					getItemCount={this.getItemCount}
					renderItem={({ item }) => <Transaction transaction={item} />}
					keyExtractor={item => item.getHash()}
				/>
			);
		}
		else {
			return (
				<EmptyTransactionContainer>
					<EmptyTransactionEmoji>Loadink...</EmptyTransactionEmoji>
					<EmptyTransactionText>(ノ°Д°）ノ︵ ┻━┻</EmptyTransactionText>
				</EmptyTransactionContainer>
			);
		}
	}

	render() {
		return <View>{this.renderTransactions()}</View>;
	}

	componentDidMount() {
		// this.__mounted = true;
		this.unsub = TxStorage.storage.subscribe(this);
		// this.storage.tempGetAllAsList().then(this.subNewTransactions.bind(this));
	}

	componentWillUnmount() {
		// this.__mounted = false;
		this.unsub();
	}
}

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
