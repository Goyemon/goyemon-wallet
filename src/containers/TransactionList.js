'use strict';
import React, { Component } from 'react';
import { View, VirtualizedList } from 'react-native';
import styled from 'styled-components/native';
import Transaction from './Transaction';

import TxStorage from '../lib/tx.js';

class TransactionList extends Component {
	constructor(props) {
		super(props);

		this.state = {
			'transactions': null,
			'transactionsLoaded': false
		}

		this.forceUpdate = false;
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (this.forceUpdate) {
			this.forceUpdate = false;
			return true;
		}

		let upd;

		if (nextProps && this.props)
			upd = Object.entries(nextProps).some(([k, v]) => this.props[k] !== v);

		if (!upd && nextState && this.state)
			upd = Object.entries(nextState).some(([k, v]) => this.state[k] !== v);

		return upd;
	}


	updateTxListState(txes) {
		let transactionlist;

		if (this.props.tokenFilter && this.props.tokenFilter == 'Dai')
			transactionlist = txes ? txes.filter(TxStorage.storage.txfilter_isRelevantToDai) : [];

		else
			transactionlist = txes;

		// transactionlist.sort((a, b) => b.getTimestamp() - a.getTimestamp());

		this.setState({
			transactions: transactionlist,
			transactionsLoaded: true
		});

		this.forceUpdate = true;
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
					initialNumToRender={32}
					maxToRenderPerBatch={32}
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
					<EmptyTransactionText>Loadink...</EmptyTransactionText>
					<EmptyTransactionEmoji>(ノ°Д°）ノ︵ ┻━┻</EmptyTransactionEmoji>
				</EmptyTransactionContainer>
			);
		}
	}

	render() {
		return <View>{this.renderTransactions()}</View>;
	}

	componentDidMount() {
		// this.__mounted = true;
		this.unsub = TxStorage.storage.subscribe(this.updateTxListState.bind(this));
		TxStorage.storage.tempGetAllAsList().then(this.updateTxListState.bind(this)); // initial load
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
