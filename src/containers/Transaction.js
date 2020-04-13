'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styled from 'styled-components';
import Web3 from 'web3';
import { GoyemonText } from '../components/common';
import { TouchableCardContainer } from '../components/common';
import TransactionUtilities from '../utilities/TransactionUtilities.ts';

import TxStorage from '../lib/tx.js';
import LogUtilities from '../utilities/LogUtilities';

/*	=======================================================
  2020-03-02 13:19:12
  TODO: this needs a lot of simplification. A litany of if()elseif()s is not easy to follow. There are much simplified logical conditions which can do that.
  Additionally, a lot of stuff just ends without returning any value potentially (no default case when none of if()s matches).
  ======================================================= */

class Transaction extends Component {
	constructor(props) {
		super(props);
		this.state = { transaction: null };
	}

	recomputeAllTheWeirdoConstsAndStuff(tx) {
    const { checksumAddress } = this.props;
		let newState = {};

		if (tx instanceof TxStorage.Tx) {
			newState.transaction = tx;
			try {
				const uniswaps = tx.getTokenOperations('uniswap', TxStorage.TxTokenOpTypeToName.eth2tok);
				newState.isUniswapTx = uniswaps.length > 0;
				newState.ethSold;
				newState.tokenBought;
				if (newState.isUniswapTx) {
					newState.ethSold = TransactionUtilities.parseEthValue(`0x${uniswaps[0].eth_sold}`);
					newState.tokenBought = TransactionUtilities.parseHexDaiValue(`0x${uniswaps[0].tok_bought}`);
				}

				newState.isDaiApproveTx = tx.hasTokenOperation('dai', TxStorage.TxTokenOpTypeToName.approval);

				const cDaiMints = tx.getTokenOperations('cdai', TxStorage.TxTokenOpTypeToName.mint);
				newState.isCDaiMintTx = cDaiMints.length > 0;
				newState.cDaiMintValue;
				if (newState.isCDaiMintTx)
					newState.cDaiMintValue = TransactionUtilities.parseHexDaiValue(`0x${cDaiMints[0].mintUnderlying}`);

				const cDaiRedeems = tx.getTokenOperations('cdai', TxStorage.TxTokenOpTypeToName.redeem);
				newState.isCDaiRedeemUnderlyingTx = cDaiRedeems.length > 0;
				newState.cDaiRedeemValue;
				if (newState.isCDaiRedeemUnderlyingTx)
					newState.cDaiRedeemValue = TransactionUtilities.parseHexDaiValue(`0x${cDaiRedeems[0].redeemUnderlying}`);

				const cDaiFails = tx.getTokenOperations('cdai', TxStorage.TxTokenOpTypeToName.failure);
				newState.isCDaiFailedTx = cDaiFails.length > 0;
				newState.isCDaiMintFailedTx;
				cDaiFails.forEach((tokenOp) => {
					newState.isCDaiMintFailedTx = newState.isCDaiMintFailedTx || (parseInt(tokenOp.info, 16) === 38);
				});

				newState.isCDaiRedeemUnderlyingFailedTx = false;
				cDaiFails.forEach((tokenOp) => {
					const failInfo = parseInt(tokenOp.info, 16);
					newState.isCDaiRedeemUnderlyingFailedTx = newState.isCDaiRedeemUnderlyingFailedTx || failInfo == 42 || failInfo == 45 || failInfo == 46;
				});

				const ameTrs = tx.getTokenOperations('ame_ropsten', TxStorage.TxTokenOpTypeToName.transfer);
				newState.isAmeTransferTx = ameTrs.length > 0;
				newState.isOutgoingAmeTx;
				newState.isIncomingAmeTx;
				newState.ameTransferValue;
				if (newState.isAmeTransferTx) {
					newState.ameTransferValue = TransactionUtilities.parseHexDaiValue(`0x${ameTrs[0].amount}`);
					newState.isOutgoingAmeTx = ameTrs.some((x) => Web3.utils.toChecksumAddress(x.from_addr) === checksumAddress);
					newState.isIncomingAmeTx = ameTrs.some((x) => Web3.utils.toChecksumAddress(x.to_addr) === checksumAddress);
				}

				const daiTrs = tx.getTokenOperations('dai', TxStorage.TxTokenOpTypeToName.transfer);
				newState.isDaiTransferTx = daiTrs.length > 0;
				newState.isOutgoingDaiTx;
				newState.isIncomingDaiTx;
				newState.daiTransferValue;
				if (newState.isDaiTransferTx) {
					newState.daiTransferValue = TransactionUtilities.parseHexDaiValue(`0x${daiTrs[0].amount}`);
					newState.isOutgoingDaiTx = daiTrs.some((x) => Web3.utils.toChecksumAddress(x.from_addr) === checksumAddress);
					newState.isIncomingDaiTx = daiTrs.some((x) => Web3.utils.toChecksumAddress(x.to_addr) === checksumAddress);
				}

				if (tx.getFrom() != null && tx.getTo() != null) {
					newState.isOutgoingEthTx = Web3.utils.toChecksumAddress(tx.getFrom()) === checksumAddress;
					newState.isIncomingEthTx = Web3.utils.toChecksumAddress(tx.getTo()) === checksumAddress;
				}
			}
			catch (e) {
				newState.derpbugexception = `Transaction() exception: ${e.message} @ ${e.stack} || ${JSON.stringify(tx)}`;
			}
		}
		else {
			newState.transaction = null;
			// LogUtilities.toDebugScreen(tx);
			// TxStorage.storage.getTx(tx.getFrom(), tx.filter).then(x => this.recomputeAllTheWeirdoConstsAndStuff(x));
		}

		this.setState(newState);
	}

	componentDidMount() {
		// LogUtilities.toDebugScreen(this.state.transaction);
		TxStorage.storage.getTx(this.props.transaction.index, this.props.transaction.filter).then(x => this.recomputeAllTheWeirdoConstsAndStuff(x));
	}

	componentWillUnmount() {

	}

	componentDidUpdate(prevProps) {
		if (this.props.updateCounter !== prevProps.updateCounter)
			TxStorage.storage.getTx(this.props.transaction.index, this.props.transaction.filter).then(x => this.recomputeAllTheWeirdoConstsAndStuff(x));

	}

  renderInOrOutTransactionIcon() {
    if(this.state.isUniswapTx) {
      return (
        <GoyemonText fontSize={16}>
          <Icon name="swap-horizontal" size={20} color="#5F5F5F" />
        </GoyemonText>
      );
    }

    if (this.state.isDaiTransferTx) {
      if (this.state.isOutgoingDaiTx && this.state.isIncomingDaiTx)
        return (
          <GoyemonText fontSize={16}>
            <Icon name="arrow-collapse" size={20} color="#5F5F5F" />
          </GoyemonText>
        );

      else if (this.state.isOutgoingDaiTx)
        return (
          <GoyemonText fontSize={16}>
            <Icon name="call-made" size={20} color="#F1860E" />
          </GoyemonText>
        );

      else if (this.state.isIncomingDaiTx)
        return (
          <GoyemonText fontSize={16}>
            <Icon name="call-received" size={20} color="#1BA548" />
          </GoyemonText>
        );
    }

    if (this.state.isAmeTransferTx) {
      if (this.state.isOutgoingAmeTx)
        return (
          <GoyemonText fontSize={16}>
            <Icon name="call-made" size={20} color="#F1860E" />
          </GoyemonText>
        );

      else if (this.state.isIncomingAmeTx)
        return (
          <GoyemonText fontSize={16}>
            <Icon name="call-received" size={20} color="#1BA548" />
          </GoyemonText>
        );
    }

    if (this.state.isCDaiFailedTx)
      return (
        <GoyemonText fontSize={16}>
          <Icon name="alert-circle-outline" size={20} color="#E41B13" />
        </GoyemonText>
      );

    if (this.state.isDaiApproveTx || this.state.isCDaiMintTx)
      return (
        <GoyemonText fontSize={16}>
          <Icon name="call-made" size={20} color="#F1860E" />
        </GoyemonText>
      );

    if (this.state.isCDaiRedeemUnderlyingTx)
      return (
        <GoyemonText fontSize={16}>
          <Icon name="call-received" size={20} color="#1BA548" />
        </GoyemonText>
      );

    if (this.state.isOutgoingEthTx && this.state.isIncomingEthTx)
      return (
        <GoyemonText fontSize={16}>
          <Icon name="arrow-collapse" size={20} color="#5F5F5F" />
        </GoyemonText>
      );

    if (this.state.transaction.getFrom() == null || this.state.isOutgoingEthTx)
      return (
        <GoyemonText fontSize={16}>
          <Icon name="call-made" size={20} color="#F1860E" />
        </GoyemonText>
      );

    if (this.state.isIncomingEthTx)
      return (
        <GoyemonText fontSize={16}>
          <Icon name="call-received" size={20} color="#1BA548" />
        </GoyemonText>
      );

  }

  renderStatus() {
    let text;

    switch (this.state.transaction.getState()) {
      case TxStorage.TxStates.STATE_NEW:
        text = 'pending...';
        break;

      case TxStorage.TxStates.STATE_PENDING:
        text = 'pending...';
        break;

      case TxStorage.TxStates.STATE_INCLUDED:
        text = 'success';
        break;

      case TxStorage.TxStates.STATE_CONFIRMED:
        text = 'success';
        break;

      case TxStorage.TxStates.STATE_ERROR:
        return (
          <View>
            <FailedStatusText>failed</FailedStatusText>
            <FailedStatusHintText>*try syncing in the advanced settings</FailedStatusHintText>
          </View>
        );

      default:
        // TODO: exception?
    }

    return <GoyemonText fontSize={20}>{text}</GoyemonText>;
  }

  renderType() {
    let txType;
    if (this.state.isUniswapTx) {
      txType = 'Swap';
      return <GoyemonText fontSize={18}>{txType}</GoyemonText>;
    }

    if (this.state.isDaiTransferTx) {
      if (this.state.isOutgoingDaiTx && this.state.isIncomingDaiTx)
        txType = 'Self';
      else if (this.state.isOutgoingDaiTx)
        txType = 'Outgoing';
      else if (this.state.isIncomingDaiTx)
        txType = 'Incoming';

      return <GoyemonText fontSize={18}>{txType}</GoyemonText>;
    }

    if (this.state.isAmeTransferTx) {
      if (this.state.isOutgoingAmeTx)
        txType = 'Outgoing';
      else if (this.state.isIncomingAmeTx)
        txType = 'Incoming';

      return <GoyemonText fontSize={18}>{txType}</GoyemonText>;
    }

    if (this.state.isCDaiMintFailedTx)
      txType = 'Deposit Failed';
    else if (this.state.isCDaiRedeemUnderlyingFailedTx)
      txType = 'Withdraw Failed';

    if (txType)
      return <GoyemonText fontSize="14">{txType}</GoyemonText>;

    if (this.state.isDaiApproveTx)
      txType = 'Unlock Deposit';
    else if (this.state.isCDaiMintTx)
      txType = 'Deposit';
    else if (this.state.isCDaiRedeemUnderlyingTx)
      txType = 'Withdraw';

    if (txType)
      return <GoyemonText fontSize={18}>{txType}</GoyemonText>;

    if (this.state.isOutgoingEthTx && this.state.isIncomingEthTx)
      txType = 'Self';
    else if (this.state.transaction.getFrom() === null || this.state.isOutgoingEthTx)
      txType = 'Outgoing';
    else if (this.state.isIncomingEthTx)
      txType = 'Incoming';

    if (txType)
      return <GoyemonText fontSize={18}>{txType}</GoyemonText>;
  }

  renderPlusOrMinusTransactionIcon() {
    if (this.state.isUniswapTx) {
      return null;
    }

    if (this.state.isDaiTransferTx) {
      if (this.state.isOutgoingDaiTx && this.state.isIncomingDaiTx)
        return <Icon name="plus-minus" size={16} color="#5F5F5F" />;
      else if (this.state.isOutgoingDaiTx)
        return <Icon name="minus" size={16} color="#F1860E" />;
      else if (this.state.isIncomingDaiTx)
        return <Icon name="plus" size={16} color="#1BA548" />;
    }

    if (this.state.isAmeTransferTx) {
      if (this.state.isOutgoingAmeTx)
        return <Icon name="minus" size={16} color="#F1860E" />;
      else if (this.state.isIncomingAmeTx)
        return <Icon name="plus" size={16} color="#1BA548" />;
    }

    if (this.state.isDaiApproveTx)
      return;

    if (this.state.isCDaiFailedTx)
      return null;

    if (this.state.isCDaiMintTx)
      return <Icon name="minus" size={16} color="#F1860E" />;

    if (this.state.isCDaiRedeemUnderlyingTx)
      return <Icon name="plus" size={16} color="#1BA548" />;


    if (this.state.isOutgoingEthTx && this.state.isIncomingEthTx)
      return <Icon name="plus-minus" size={16} color="#5F5F5F" />;
    else if (this.state.transaction.getFrom() == null || this.state.isOutgoingEthTx)
      return <Icon name="minus" size={16} color="#F1860E" />;
    else if (this.state.isIncomingEthTx)
      return <Icon name="plus" size={16} color="#1BA548" />;
  }

  renderValue() {
    if (this.state.isUniswapTx) {
      const uniswaps = this.state.transaction.getTokenOperations('uniswap', TxStorage.TxTokenOpTypeToName.eth2tok);
      this.state.tokenBought = TransactionUtilities.parseHexDaiValue(`0x${uniswaps[0].tok_bought}`);

      let style;
      style = styles.valueStyleGreen;
      return (
        <SwapValueContainer>
          <SwapValueTextContainer>
            <Icon name="minus" size={16} color="#F1860E" />
            <GoyemonText fontSize={16} style={style}>
              {this.state.ethSold} ETH
            </GoyemonText>
          </SwapValueTextContainer>
          <Icon name="swap-vertical" size={16} color="#1BA548" />
          <SwapValueTextContainer>
          <Icon name="plus" size={16} color="#1BA548" />
            <GoyemonText fontSize={16} style={style}>
              {this.state.tokenBought} DAI
            </GoyemonText>
          </SwapValueTextContainer>
        </SwapValueContainer>
      );
    }

    if (this.state.isDaiTransferTx) {
      let style;

      if (this.state.isOutgoingDaiTx)
        style = styles.valueStyleRed;
      else if (this.state.isIncomingDaiTx)
        style = styles.valueStyleGreen;

      return (
        <GoyemonText fontSize={16} style={style}>
          {this.state.daiTransferValue} DAI
        </GoyemonText>
      );
    }

    if (this.state.isAmeTransferTx) {
      let style;

      if (this.state.isOutgoingAmeTx) // is it possible that they're neither? both in here and for DAI this code uses else if, but should be just else imo.
        style = styles.valueStyleRed
      else if (this.state.isIncomingAmeTx)
          style = styles.valueStyleGreen;

      return (
        <GoyemonText fontSize={16} style={style}>
          {this.state.ameTransferValue} AME
        </GoyemonText>
      );
    }

    if (this.state.isDaiApproveTx)
      return null;

    if (this.state.isCDaiFailedTx)
      return <GoyemonText fontSize={16}>0</GoyemonText>;

    if (this.state.isCDaiMintTx)
      return (
        <GoyemonText fontSize={16} style={styles.valueStyleRed}>
          {this.state.cDaiMintValue} DAI
        </GoyemonText>
      );

    if (this.state.isCDaiRedeemUnderlyingTx)
      return (
        <GoyemonText fontSize={16} style={styles.valueStyleGreen}>
          {this.state.cDaiRedeemValue} DAI
        </GoyemonText>
      );

    if (this.state.transaction.getFrom() === null)
      return <GoyemonText fontSize={16}>Token Transfer</GoyemonText>;

    if (this.state.transaction.getTo() === null)
      return <GoyemonText fontSize={16}>Contract Creation</GoyemonText>;


    const roundedEthValue = parseFloat(TransactionUtilities.parseEthValue(`0x${this.state.transaction.getValue()}`)).toFixed(4);
    if (this.state.isOutgoingEthTx)
      return (
        <GoyemonText fontSize={16} style={styles.valueStyleRed}>
          {roundedEthValue} ETH
        </GoyemonText>
      );
    else if (this.state.isIncomingEthTx)
      return (
        <GoyemonText fontSize={16} style={styles.valueStyleGreen}>
          {roundedEthValue} ETH
        </GoyemonText>
      );
  }



  render() {
    if (this.state.derpbugexception)
	  return <GoyemonText fontSize={12}>{this.state.derpbugexception}</GoyemonText>;

	if (!(this.state.transaction instanceof TxStorage.Tx))
		return <GoyemonText fontSize={12}>...</GoyemonText>; // TODO: this likely needs to be, well, something else.

    try {
      const time = TransactionUtilities.parseTransactionTime(this.state.transaction.getTimestamp());

      return (
        <TouchableCardContainer
          alignItems="center"
          borderRadius="0"
          flexDirection="row"
          height="96px"
          justifyContent="center"
          marginTop="0"
          textAlign="left"
          width="95%"
          onPress={() => LogUtilities.dumpObject('tx', this.state.transaction)}>
          <TransactionList>
            <InOrOutTransactionContainer>
              {this.renderInOrOutTransactionIcon()}
            </InOrOutTransactionContainer>
            <TypeTimeContainer>
              <Type>{this.renderType()}</Type>
              <Time>{time}</Time>
            </TypeTimeContainer>
            <StatusContainer>{this.renderStatus()}</StatusContainer>
            <ValueContainer>
              {this.renderPlusOrMinusTransactionIcon()}
              <View>{this.renderValue()}</View>
            </ValueContainer>
          </TransactionList>
        </TouchableCardContainer>
      );
    }
    catch (e) {
      const exc = `Transaction render() exception: ${e.message} @ ${e.stack} || ${JSON.stringify(this.transaction)}`;
      return <GoyemonText fontSize={12}>{exc}</GoyemonText>;
    }
  }
}

const styles = {
  valueStyleRed: {
    color: '#F1860E'
  },
  valueStyleGreen: {
    color: '#1BA548'
  }
};

const TransactionList = styled.View`
  align-items: center;
  flex: 1;
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
`;

const InOrOutTransactionContainer = styled.View`
  width: 10%;
`;

const TypeTimeContainer = styled.View`
  width: 30%;
`;

const Type = styled.Text`
  font-family: 'HKGrotesk-Regular';
  margin-bottom: 4;
`;

const Time = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
`;

const StatusContainer = styled.View`
  width: 30%;
`;

const FailedStatusText = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  font-size: 20;
`;

const FailedStatusHintText = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  font-size: 12;
`;

const ValueContainer = styled.View`
  align-items: center;
  flex-direction: row;
  width: 30%;
`;

const SwapValueContainer = styled.View`
  align-items: center;
  flex-direction: column;
`;

const SwapValueTextContainer = styled.View`
  align-items: center;
  flex-direction: row;
`;

const mapStateToProps = state => ({
  checksumAddress: state.ReducerChecksumAddress.checksumAddress
});

export default connect(mapStateToProps)(Transaction);
