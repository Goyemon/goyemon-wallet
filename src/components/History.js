'use strict';
import React, { Component } from 'react';
import { TouchableOpacity, Modal, Alert } from 'react-native';
import styled from 'styled-components';
import { HeaderOne, TxConfirmationButton } from '../components/common/';
// TODO: git rm those two:
//import Transactions from '../containers/Transactions';
//import TransactionsDai from '../containers/TransactionsDai';
import OfflineNotice from '../containers/common/OfflineNotice';
import TransactionList from '../containers/TransactionList';
import I18n from '../i18n/I18n';
import TxStorage from '../lib/tx.js';
import LogUtilities from '../utilities/LogUtilities';
import TransactionUtilities from '../utilities/TransactionUtilities';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AdvancedContainer from '../containers/common/AdvancedContainer';

class TaiPleaseChangeNameOfThisModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			txToUpdate: null
		};
	}

	componentDidUpdate(prevProps) {
		if (this.props.txToUpdate !== prevProps.txToUpdate)
			this.setState({ txToUpdate: this.props.txToUpdate });
	  }

	async resendTx() {
		// update gas
		const newTx = this.state.txToUpdate.deepClone();
		newTx.setGasPrice(TransactionUtilities.returnTransactionSpeed(2).toString(16));

		await TxStorage.storage.updateTx(newTx); // temporarily no if
		await TransactionUtilities.sendTransactionToServer(newTx);

		// if (await TxStorage.storage.updateTx(newTx))
		// 	await TransactionUtilities.sendTransactionToServer(newTx);
	}



	render() {
		if (this.state.txToUpdate != null)
			return (
				<Modal
					animationType="slide"
					transparent
					visible={true}
					onRequestClose={() => {
						Alert.alert('Modal has been closed.');
					}}
				>
					<ModalContainer>
						<ModalBackground>
							<CloseButton onPress={() => { this.props.onClose(); }}>
								<Icon name="chevron-down" color="#5F5F5F" size={24} />
							</CloseButton>
							<HeaderOne marginTop="64">I like pancakes; current gas price: {this.state.txToUpdate.getGasPrice()}</HeaderOne>
							<AdvancedContainer gasLimit={parseInt(this.state.txToUpdate.getGas(), 16)} expandByDefault={true} />
							<TxConfirmationButton
								text={"Resend (needs i18n)"}
								disabled={false}
								onPress={this.resendTx.bind(this)}
							/>
						</ModalBackground>
					</ModalContainer>
				</Modal>
			);

		return null;
	}
}

const ModalContainer = styled.View`
	align-items: flex-end;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	flex-direction: row;
	justify-content: center;
	height: 100%;
`;

const ModalBackground = styled.View`
	background-color: #fff;
	border-radius: 16px;
	height: 50%;
	min-height: 200px;
	width: 98%;
`;
const CloseButton = styled.TouchableOpacity`
	margin-left: 16;
	margin-top: 16;
`;


export default class History extends Component {
  constructor(props) {
    super(props);
    this.state = {
	  filter: 'All',
	  editedTx: null
    };
  }

  toggleFilterChoiceText() {
    const choices = ['All', 'Dai'].map((filter) => {
      if (filter === this.state.filter)
        return (
          <FilterChoiceTextSelected key={filter}>
            {filter}
          </FilterChoiceTextSelected>
        );

      return (
        <TouchableOpacity
          key={filter}
          onPress={() => this.setState({ filter })}
        >
          <FilterChoiceTextUnselected>{filter}</FilterChoiceTextUnselected>
        </TouchableOpacity>
      );
    });

    return <FilterChoiceContainer>{choices}</FilterChoiceContainer>;
  }

  txTapped(tx) {
	LogUtilities.dumpObject('tx', tx);
	// if (tx.getState() < TxStorage.TxStates.STATE_INCLUDED) {
		// this.props.saveTxConfirmationModalVisibility(true);
		//   this.props.updateTxConfirmationModalVisibleType('i like pancakes');
		this.setState({ editedTx: tx });
	// }
  }
  txClear() {
	  this.setState({ editedTx: null });
  }

  render() {
    return (
      <HistoryContainer>
	  	<TaiPleaseChangeNameOfThisModal txToUpdate={this.state.editedTx} onClose={this.txClear.bind(this)} />
        <OfflineNotice />
        <HeaderOne marginTop="64">{I18n.t('history')}</HeaderOne>
        {this.toggleFilterChoiceText()}
        <TransactionList
		  onTxTapped={this.txTapped.bind(this)}
          tokenFilter={this.state.filter}
          key={`TransactionList_${this.state.filter}`}
        />
      </HistoryContainer>
    );
  }
}

const HistoryContainer = styled.View`
  background: #f8f8f8;
  height: 100%;
`;

const FilterChoiceContainer = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: flex-start;
  margin-top: 24;
  margin-bottom: 12;
  margin-left: 16;
`;

const FilterChoiceTextSelected = styled.Text`
  color: #000;
  font-size: 24;
  font-weight: bold;
  margin-right: 12;
  text-transform: uppercase;
`;

const FilterChoiceTextUnselected = styled.Text`
  font-size: 24;
  font-weight: bold;
  margin-right: 12;
  opacity: 0.4;
  text-transform: uppercase;
`;
