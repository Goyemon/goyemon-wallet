'use strict';
import React, { Component } from 'react';
import { TouchableOpacity, Modal, View } from 'react-native';
import styled from 'styled-components';
import { HeaderOne, TxConfirmationButton } from '../components/common/';
import { connect } from 'react-redux';

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
import { TxSpeedSelectionContainer } from '../containers/common/AdvancedContainer';

const propsToStateChecksumAddr = (state) => ({
  checksumAddress: state.ReducerChecksumAddress.checksumAddress
});

const DescriptiveNameOfTheTransactionDetailShowingStupidComponentWhichIsBasicallyAView = connect(propsToStateChecksumAddr)(
class DescriptiveNameOfTheTransactionDetailShowingStupidComponentWhichIsBasicallyAView extends Component { // separated so we can reuse the same display in other places
	constructor(props) {
		super(props);
		this.state = {
			txData: this.computeTxData(props.tx)
		};
	}

	computeTxData(tx) {
		if (!tx)
			return null;

		// looking at Transaction.js, the classification of transaction type priority looks like this:
		// this.state.isUniswapTx, txType = I18n.t('history-swap');

		// this.state.isDaiTransferTx,
		// 	this.state.isOutgoingDaiTx && this.state.isIncomingDaiTx, txType = 'Self'
		// 	this.state.isOutgoingDaiTx, txType = I18n.t('history-outgoing')
		// 	this.state.isIncomingDaiTx, txType = I18n.t('history-incoming')

		// this.state.isAmeTransferTx,
		// 	this.state.isOutgoingAmeTx, txType = I18n.t('history-outgoing')
		// 	this.state.isIncomingAmeTx, txType = I18n.t('history-incoming')

		// this.state.isCDaiMintFailedTx, txType = I18n.t('deposit') + ' ' + I18n.t('history-failed');
		// this.state.isCDaiRedeemUnderlyingFailedTx, txType = I18n.t('withdraw') + ' ' + I18n.t('history-failed');


		// this.state.isDaiApproveTx, txType = I18n.t('history-approve')
		// this.state.isCDaiMintTx || this.state.isPTdepositTx,  txType = I18n.t('deposit')
		// this.state.isCDaiRedeemUnderlyingTx || this.state.isPTwithdrawTx, txType = I18n.t('withdraw')
		// this.state.isPTRewardTx, txType = 'Rewarded'


		// this.state.isOutgoingEthTx && this.state.isIncomingEthTx, txType = 'Self';

		// this.state.transaction.getFrom() === null || this.state.isOutgoingEthTx, txType = I18n.t('history-outgoing');
		// this.state.isIncomingEthTx, txType = I18n.t('history-incoming');


		// These need to be reordered to match the order from above
		let topdata = tx.getTokenOperations('uniswap', TxStorage.TxTokenOpTypeToName.eth2tok);
		if (topdata.length > 0)
			return {
				type: 'swap',
				eth_sold: TransactionUtilities.parseEthValue(`0x${topdata[0].eth_sold}`),
				tokens_bought: TransactionUtilities.parseHexDaiValue(`0x${topdata[0].tok_bought}`),
				token: 'DAI'
			};


		topdata = tx.hasTokenOperation('dai', TxStorage.TxTokenOpTypeToName.approval);
		if (topdata.length > 0)
			return {
				type: 'approval',
				token: 'DAI'
			}


		topdata = tx.getTokenOperations('pooltogether', TxStorage.TxTokenOpTypeToName.PTdeposited)
			.concat(tx.getTokenOperations('pooltogether', TxStorage.TxTokenOpTypeToName.PTdepositedAndCommitted))
			.concat(tx.getTokenOperations('pooltogether', TxStorage.TxTokenOpTypeToName.PTsponsorshipDeposited));
		if (topdata.length > 0)
			return {
				type: 'deposit',
				amount: TransactionUtilities.parseHexDaiValue(`0x${topdata[0].depositPoolAmount}`),
				token: 'DAI'
			}


		topdata = tx.getTokenOperations('pooltogether', TxStorage.TxTokenOpTypeToName.PTwithdrawn)
			.concat(tx.getTokenOperations('pooltogether', TxStorage.TxTokenOpTypeToName.PTopenDepositWithdrawn))
			.concat(tx.getTokenOperations('pooltogether', TxStorage.TxTokenOpTypeToName.PTsponsorshipAndFeesWithdrawn))
			.concat(tx.getTokenOperations('pooltogether', TxStorage.TxTokenOpTypeToName.PTcommittedDepositWithdrawn));
		if (topdata.length > 0)
			return {
				type: 'withdraw',
				token: 'DAI',
				amount: (
					topdata[0] instanceof TxStorage.TxTokenOpNameToClass[TxStorage.TxTokenOpTypeToName.PTwithdrawn]
						? TransactionUtilities.parseHexDaiValue(`0x${topdata[0].withdrawAmount}`)
						: TransactionUtilities.parseHexDaiValue(`0x${topdata.reduce((x, y) => x.plus(y.withdrawAmount, 16), new BigNumber(0)).toString(16)}`) // TODO: why do we convert this to hex and then back? wouldnt it be better to just divide the BigNumber by decimal places of DAI?
				)
			}


		topdata = tx.getTokenOperations('pooltogether', TxStorage.TxTokenOpTypeToName.PTrewarded);
		if (topdata.length > 0)
			return {
				type: 'rewarded',
				amount: TransactionUtilities.parseHexDaiValue(`0x${topdata[0].winnings}`),
				token: 'DAI'
			}


		topdata = tx.getTokenOperations('cdai', TxStorage.TxTokenOpTypeToName.mint);
		if (topdata.length > 0)
			return {
				type: 'deposit',
				amount: TransactionUtilities.parseHexDaiValue(`0x${topdata[0].mintUnderlying}`),
				token: 'DAI'
			}

		topdata = tx.getTokenOperations('cdai', TxStorage.TxTokenOpTypeToName.redeem);
		if (topdata.length > 0)
			return {
				type: 'withdraw',
				amount: TransactionUtilities.parseHexDaiValue(`0x${topdata[0].redeemUnderlying}`),
				token: 'DAI'
			}


		topdata = tx.getTokenOperations('cdai', TxStorage.TxTokenOpTypeToName.failure);
		if (topdata.length > 0)
			return {
				type: 'failure',
				failop: (
					topdata.some(x => parseInt(x.info, 16) == 38)
					? 'mint'
					: (
						topdata.some(x => [42, 45, 46].contains(parseInt(x.info, 16)))
						? 'redeem'
						: 'unknown'
					)
				)
			}


		const our_reasonably_stored_address = (this.props.checksumAddress.substr(0, 2) == '0x' ? this.props.checksumAddress.substr(2) : this.props.checksumAddress).toLowerCase();
		topdata = tx.getTokenOperations('ame_ropsten', TxStorage.TxTokenOpTypeToName.transfer);
		if (topdata.length > 0)
			return {
				type: 'transfer',
				amount: TransactionUtilities.parseHexDaiValue(`0x${topdata[0].amount}`),
				direction: (
					topdata[0].from_addr === our_reasonably_stored_address
					? (
						topdata[0].to_addr === our_reasonably_stored_address
						? 'self'
						: 'outgoing'
					)
					: (
						topdata[0].to_addr === our_reasonably_stored_address
						? 'incoming'
						: 'unknown'
					)
				),
				token: 'AME'
			}


		topdata = tx.getTokenOperations('DAI', TxStorage.TxTokenOpTypeToName.transfer);
		if (topdata.length > 0)
			return {
				type: 'transfer',
				amount: TransactionUtilities.parseHexDaiValue(`0x${topdata[0].amount}`),
				direction: (
					topdata[0].from_addr === our_reasonably_stored_address
					? (
						topdata[0].to_addr === our_reasonably_stored_address
						? 'self'
						: 'outgoing'
					)
					: (
						topdata[0].to_addr === our_reasonably_stored_address
						? 'incoming'
						: 'unknown'
					)
				),
				token: 'DAI'
			}


		const ethdirection =
			(tx.getFrom() && tx.getFrom() === `0x${our_reasonably_stored_address}` ? 1 : 0) +
			(tx.getTo() && tx.getTo() === `0x${our_reasonably_stored_address}` ? 2 : 0);
		if (ethdirection > 0)
			return {
				type: 'transfer',
				direction: (ethdirection == 1 ? 'outgoing' : (ethdirection == 2 ? 'incoming' : 'self')),
				amount: tx.getValue(),
				token: 'eth'
			}
	}

	componentDidUpdate(prevProps) {
		if (this.props.tx !== prevProps.tx)
			this.setState({ txData: this.computeTxData(this.props.tx) });
	}

	render() {
		if (!this.state.txData)
			return <RandomText>nothink!</RandomText>;

		return <RandomText>{JSON.stringify(this.state.txData, null, 1)}</RandomText>;
	}
}
); // connect()

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
				<Modal animationType="slide" transparent visible={true}>
					<ModalContainer>
						<ModalBackground>
							<CloseButton onPress={() => { this.props.onClose(); }}>
								<Icon name="chevron-down" color="#5F5F5F" size={24} />
							</CloseButton>

							<TxSpeedSelectionContainer gasLimit={parseInt(this.state.txToUpdate.getGas(), 16)} expandByDefault={true} />

							<TxConfirmationButton
								text={"Resend (needs i18n)"}
								onPress={this.resendTx.bind(this)}
							/>

						<RandomText>TX data:</RandomText>
						<DescriptiveNameOfTheTransactionDetailShowingStupidComponentWhichIsBasicallyAView tx={this.state.txToUpdate} />
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
	min-height: 200px;
	width: 98%;
`;
const CloseButton = styled.TouchableOpacity`
	margin-left: 16;
	margin-top: 16;
`;

const RandomText = styled.Text`
	color: #aaaaaa;
  	font-size: 18;
  	font-weight: bold;
`;


export default connect(propsToStateChecksumAddr)(class History extends Component {
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
		  ourAddress={this.props.checksumAddress}
		  onTxTapped={this.txTapped.bind(this)}
          tokenFilter={this.state.filter}
          key={`TransactionList_${this.state.filter}`}
        />
      </HistoryContainer>
    );
  }
});

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
