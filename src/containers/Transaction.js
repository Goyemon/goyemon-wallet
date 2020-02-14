'use strict';
import BigNumber from 'bignumber.js';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styled from 'styled-components';
import Web3 from 'web3';
import { UntouchableCardContainer, CrypterestText } from '../components/common';
import TransactionUtilities from '../utilities/TransactionUtilities.ts';

class Transaction extends Component {
  constructor(props) {
    super(props);
    this.isAmeTransferTx = props.transaction.hasOwnProperty('ame_ropsten_tr');
    this.isDaiTransferTx = props.transaction.hasOwnProperty('dai_tr');
    this.isDaiApproveTx = props.transaction.hasOwnProperty('dai_appr');
    this.isCDaiMintTx = props.transaction.hasOwnProperty('cdai_mint');
    this.isCDaiRedeemUnderlyingTx = props.transaction.hasOwnProperty('cdai_redeem');
    this.isCDaiFailedTx = props.transaction.hasOwnProperty('cdai_failed');
    this.isCDaiMintFailedTx;
    this.isCDaiRedeemUnderlyingFailedTx;
    if(this.isCDaiFailedTx) {
      this.isCDaiMintFailedTx = props.transaction.cdai_failed.failureInfo === 38;
      this.isCDaiRedeemUnderlyingFailedTx = props.transaction.cdai_failed.failureInfo === 42 || 45;
    }
    this.isOutgoingAmeTx;
    this.isIncomingAmeTx;
    if (props.transaction.hasOwnProperty('ame_ropsten_tr')) {
      this.isOutgoingAmeTx =
        Web3.utils.toChecksumAddress(props.transaction.ame_ropsten_tr.from) ===
        props.checksumAddress;
      this.isIncomingAmeTx =
        Web3.utils.toChecksumAddress(props.transaction.ame_ropsten_tr.to) === props.checksumAddress;
    }
    this.isOutgoingDaiTx;
    this.isIncomingDaiTx;
    if (props.transaction.hasOwnProperty('dai_tr')) {
      this.isOutgoingDaiTx =
        Web3.utils.toChecksumAddress(props.transaction.dai_tr.from) === this.props.checksumAddress;
      this.isIncomingDaiTx =
        Web3.utils.toChecksumAddress(props.transaction.dai_tr.to) === props.checksumAddress;
    }
    if (this.props.transaction.from != null) {
      this.isOutgoingEthTx =
        Web3.utils.toChecksumAddress(props.transaction.from) === props.checksumAddress;
      this.isIncomingEthTx =
        Web3.utils.toChecksumAddress(props.transaction.to) === props.checksumAddress;
    }
  }

  renderInOrOutTransactionIcon() {
    if (this.isDaiTransferTx) {
      if (this.isOutgoingDaiTx && this.isIncomingDaiTx) {
        return (
          <CrypterestText fontSize="16">
            <Icon name="arrow-collapse" size={20} color="#5F5F5F" />
          </CrypterestText>
        );
      } else if (this.isOutgoingDaiTx) {
        return (
          <CrypterestText fontSize="16">
            <Icon name="call-made" size={20} color="#F1860E" />
          </CrypterestText>
        );
      } else if (this.isIncomingDaiTx) {
        return (
          <CrypterestText fontSize="16">
            <Icon name="call-received" size={20} color="#1BA548" />
          </CrypterestText>
        );
      }
    }

    if (this.isAmeTransferTx) {
      if (this.isOutgoingAmeTx) {
        return (
          <CrypterestText fontSize="16">
            <Icon name="call-made" size={20} color="#F1860E" />
          </CrypterestText>
        );
      } else if (this.isIncomingAmeTx) {
        return (
          <CrypterestText fontSize="16">
            <Icon name="call-received" size={20} color="#1BA548" />
          </CrypterestText>
        );
      }
    }

    if (this.isCDaiFailedTx) {
      return (
        <CrypterestText fontSize="16">
          <Icon name="alert-circle-outline" size={20} color="#E41B13" />
        </CrypterestText>
      );
    }

    if (this.isDaiApproveTx || this.isCDaiMintTx) {
      return (
        <CrypterestText fontSize="16">
          <Icon name="call-made" size={20} color="#F1860E" />
        </CrypterestText>
      );
    }

    if (this.isCDaiRedeemUnderlyingTx) {
      return (
        <CrypterestText fontSize="16">
          <Icon name="call-received" size={20} color="#1BA548" />
        </CrypterestText>
      );
    }

    if (this.isOutgoingEthTx && this.isIncomingEthTx) {
      return (
        <CrypterestText fontSize="16">
          <Icon name="arrow-collapse" size={20} color="#5F5F5F" />
        </CrypterestText>
      );
    } else if (this.props.transaction.from === null || this.isOutgoingEthTx) {
      return (
        <CrypterestText fontSize="16">
          <Icon name="call-made" size={20} color="#F1860E" />
        </CrypterestText>
      );
    } else if (this.isIncomingEthTx) {
      return (
        <CrypterestText fontSize="16">
          <Icon name="call-received" size={20} color="#1BA548" />
        </CrypterestText>
      );
    }
  }

  renderStatus() {
    if (this.props.transaction.state === 'sent') {
      return <CrypterestText fontSize="20">sent...</CrypterestText>;
    } else if (this.props.transaction.state === 'pending') {
      return <CrypterestText fontSize="20">pending...</CrypterestText>;
    } else if (this.props.transaction.state === 'included') {
      return <CrypterestText fontSize="20">included</CrypterestText>;
    } else if (this.props.transaction.state === 'confirmed') {
      return <CrypterestText fontSize="20">confirmed</CrypterestText>;
    }
  }

  renderType() {
    if (this.isDaiTransferTx) {
      if (this.isOutgoingDaiTx && this.isIncomingDaiTx) {
        return <CrypterestText fontSize="18">Self</CrypterestText>;
      } else if (this.isOutgoingDaiTx) {
        return <CrypterestText fontSize="18">Outgoing</CrypterestText>;
      } else if (this.isIncomingDaiTx) {
        return <CrypterestText fontSize="18">Incoming</CrypterestText>;
      }
    }

    if (this.isAmeTransferTx) {
      if (this.isOutgoingAmeTx) {
        return <CrypterestText fontSize="18">Outgoing</CrypterestText>;
      } else if (this.isIncomingAmeTx) {
        return <CrypterestText fontSize="18">Incoming</CrypterestText>;
      }
    }

    if (this.isCDaiMintFailedTx) {
      return <CrypterestText fontSize="14">Deposit Failed</CrypterestText>;
    } else if (this.isCDaiRedeemUnderlyingFailedTx) {
      return <CrypterestText fontSize="14">Withdraw Failed</CrypterestText>;
    }

    if (this.isDaiApproveTx) {
      return <CrypterestText fontSize="18">Unlocked</CrypterestText>;
    } else if (this.isCDaiMintTx) {
      return <CrypterestText fontSize="18">Deposited</CrypterestText>;
    } else if (this.isCDaiRedeemUnderlyingTx) {
      return <CrypterestText fontSize="18">Withdrawn</CrypterestText>;
    }

    if (this.isOutgoingEthTx && this.isIncomingEthTx) {
      return <CrypterestText fontSize="18">Self</CrypterestText>;
    } else if (this.props.transaction.from === null || this.isOutgoingEthTx) {
      return <CrypterestText fontSize="18">Outgoing</CrypterestText>;
    } else if (this.isIncomingEthTx) {
      return <CrypterestText fontSize="18">Incoming</CrypterestText>;
    }
  }

  renderPlusOrMinusTransactionIcon() {
    if (this.isDaiTransferTx) {
      if (this.isOutgoingDaiTx && this.isIncomingDaiTx) {
        return <Icon name="plus-minus" size={16} color="#5F5F5F" />;
      } else if (this.isOutgoingDaiTx) {
        return <Icon name="minus" size={16} color="#F1860E" />;
      } else if (this.isIncomingDaiTx) {
        return <Icon name="plus" size={16} color="#1BA548" />;
      }
    }

    if (this.isAmeTransferTx) {
      if (this.isOutgoingAmeTx) {
        return <Icon name="minus" size={16} color="#F1860E" />;
      } else if (this.isIncomingAmeTx) {
        return <Icon name="plus" size={16} color="#1BA548" />;
      }
    }

    if (this.isDaiApproveTx) {
      return;
    }

    if (this.isCDaiFailedTx) {
      return null;
    }

    if (this.isCDaiMintTx) {
      return <Icon name="minus" size={16} color="#F1860E" />;
    }

    if (this.isCDaiRedeemUnderlyingTx) {
      return <Icon name="plus" size={16} color="#1BA548" />;
    }

    if (this.isOutgoingEthTx && this.isIncomingEthTx) {
      return <Icon name="plus-minus" size={16} color="#5F5F5F" />;
    } else if (this.props.transaction.from === null || this.isOutgoingEthTx) {
      return <Icon name="minus" size={16} color="#F1860E" />;
    } else if (this.isIncomingEthTx) {
      return <Icon name="plus" size={16} color="#1BA548" />;
    }
  }

  renderValue() {
    if (this.isDaiTransferTx) {
      let daiValue;
      if (!this.props.transaction.dai_tr.value) {
        daiValue = 0;
      }
      daiValue = this.props.transaction.dai_tr.value;
      if (this.isOutgoingDaiTx) {
        return (
          <CrypterestText fontSize="16" style={styles.valueStyleRed}>
            {daiValue} DAI
          </CrypterestText>
        );
      } else if (this.isIncomingDaiTx) {
        return (
          <CrypterestText fontSize="16" style={styles.valueStyleGreen}>
            {daiValue} DAI
          </CrypterestText>
        );
      }
    }

    if (this.isAmeTransferTx) {
      let ameValue;
      if (!this.props.transaction.ame_ropsten_tr.value) {
        ameValue = 0;
      }
      ameValue = this.props.transaction.ame_ropsten_tr.value;
      if (this.isOutgoingAmeTx) {
        return (
          <CrypterestText fontSize="16" style={styles.valueStyleRed}>
            {ameValue} AME
          </CrypterestText>
        );
      } else if (this.isIncomingAmeTx) {
        return (
          <CrypterestText fontSize="16" style={styles.valueStyleGreen}>
            {ameValue} AME
          </CrypterestText>
        );
      }
    }

    if (this.isDaiApproveTx) {
      return null;
    }

    if (this.isCDaiFailedTx) {
      return <CrypterestText fontSize="16">0</CrypterestText>;
    }

    if (this.isCDaiMintTx) {
      let mintDaiValue;
      if (!this.props.transaction.cdai_mint.daiDeposited) {
        mintDaiValue = 0;
      }
      mintDaiValue = this.props.transaction.cdai_mint.daiDeposited;

      return (
        <CrypterestText fontSize="16" style={styles.valueStyleRed}>
          {mintDaiValue} DAI
        </CrypterestText>
      );
    }

    if (this.isCDaiRedeemUnderlyingTx) {
      let daiRedeemValue;
      if (!this.props.transaction.cdai_redeem.daiWithdrawn) {
        daiRedeemValue = 0;
      }
      daiRedeemValue = this.props.transaction.cdai_redeem.daiWithdrawn;

      return (
        <CrypterestText fontSize="16" style={styles.valueStyleGreen}>
          {daiRedeemValue} DAI
        </CrypterestText>
      );
    }

    if (this.props.transaction.from === null) {
      return <CrypterestText fontSize="16">Token Transfer</CrypterestText>;
    }

    if (this.props.transaction.to === null) {
      return <CrypterestText fontSize="16">Contract Creation</CrypterestText>;
    }

    const roundedEthValue = parseFloat(this.props.transaction.value).toFixed(4);
    if (this.isOutgoingEthTx) {
      return (
        <CrypterestText fontSize="16" style={styles.valueStyleRed}>
          {roundedEthValue} ETH
        </CrypterestText>
      );
    } else if (this.isIncomingEthTx) {
      return (
        <CrypterestText fontSize="16" style={styles.valueStyleGreen}>
          {roundedEthValue} ETH
        </CrypterestText>
      );
    }
  }

  render() {
    let { time } = this.props.transaction;
    time = TransactionUtilities.parseTransactionTime(time);

    return (
      <UntouchableCardContainer
        alignItems="center"
        borderRadius="0"
        flexDirection="row"
        height="96px"
        justifyContent="center"
        marginTop="0"
        textAlign="left"
        width="95%"
      >
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
            <CrypterestText fontSize="16">{this.renderValue()}</CrypterestText>
          </ValueContainer>
        </TransactionList>
      </UntouchableCardContainer>
    );
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
  width: 32%;
`;

const ValueContainer = styled.View`
  align-items: center;
  flex-direction: row;
  width: 28%;
`;

const mapStateToProps = state => ({
  checksumAddress: state.ReducerChecksumAddress.checksumAddress
});

export default connect(mapStateToProps)(Transaction);
