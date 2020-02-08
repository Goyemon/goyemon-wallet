'use strict';
import BigNumber from 'bignumber.js';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Alert, View, Text } from 'react-native';
import { withNavigation } from 'react-navigation';
import styled from 'styled-components';
import Web3 from 'web3';
import { saveDaiApprovalInfo } from '../actions/ActionCDaiLendingInfo';
import { getGasPriceAverage } from '../actions/ActionGasPrice';
import { saveOutgoingDaiTransactionApproveAmount } from '../actions/ActionOutgoingDaiTransactionData';
import {
  RootContainer,
  UntouchableCardContainer,
  TransactionButton,
  HeaderOne,
  HeaderFour,
  Button,
  Description
} from '../components/common/';
import cDaiContract from '../contracts/cDaiContract';
import daiTokenContract from '../contracts/daiTokenContract';
import DebugUtilities from '../utilities/DebugUtilities.js';
import GasUtilities from '../utilities/GasUtilities.js';
import PriceUtilities from '../utilities/PriceUtilities.js';
import TransactionUtilities from '../utilities/TransactionUtilities.ts';
import Web3ProviderUtilities from '../utilities/Web3ProviderUtilities.js';

class EarnDai extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      ethAmountValidation: undefined
    };
    this.web3 = Web3ProviderUtilities.web3Provider();
    this.ethBalance = Web3.utils.fromWei(props.balance.weiBalance);
  }

  async componentDidMount() {
    if (this.props.transactions != null && this.props.transactions.length != null) {
      this.props.saveDaiApprovalInfo(TransactionUtilities.daiApproved(this.props.transactions));
    }
    this.props.getGasPriceAverage();
  }

  getTransactionFeeEstimateInUsd() {
    let transactionFeeEstimateInUsd = PriceUtilities.convertEthToUsd(
      GasUtilities.getTransactionFeeEstimateInEther(this.props.gasPrice.average, 50000)
    );
    transactionFeeEstimateInUsd = transactionFeeEstimateInUsd.toFixed(3);
    return transactionFeeEstimateInUsd;
  }

  validateEthAmount() {
    let transactionFeeLimitInEther = GasUtilities.getTransactionFeeEstimateInEther(
      this.props.gasPrice.average,
      50000
    );

    const ethBalance = new BigNumber(this.ethBalance);
    transactionFeeLimitInEther = new BigNumber(transactionFeeLimitInEther);

    if (ethBalance.isGreaterThan(transactionFeeLimitInEther)) {
      DebugUtilities.logInfo('the eth amount validated!');
      this.setState({ ethAmountValidation: true });
      return true;
    }
    DebugUtilities.logInfo('wrong eth balance!');
    this.setState({ ethAmountValidation: false });
    return false;
  }

  renderInsufficientEthBalanceMessage() {
    if (this.state.ethAmountValidation || this.state.ethAmountValidation === undefined) {
      return;
    }
    return <ErrorMessage>you don't have enough ether 😟</ErrorMessage>;
  }

  getApproveEncodedABI() {
    const daiTokenContractInstance = new this.web3.eth.Contract(
      JSON.parse(daiTokenContract.daiTokenAbi),
      daiTokenContract.daiTokenAddress
    );

    const addressSpender = cDaiContract.cDaiAddress;
    const amount = this.web3.utils.toHex(-1);

    const approveEncodedABI = daiTokenContractInstance.methods
      .approve(addressSpender, amount)
      .encodeABI();

    return approveEncodedABI;
  }

  async constructTransactionObject() {
    const transactionNonce = parseInt(TransactionUtilities.getTransactionNonce());
    const approveEncodedABI = this.getApproveEncodedABI();
    const transactionObject = {
      nonce: `0x${transactionNonce.toString(16)}`,
      to: daiTokenContract.daiTokenAddress,
      gasPrice: `0x${parseFloat(this.props.gasPrice.average).toString(16)}`,
      gasLimit: `0x${parseFloat(50000).toString(16)}`,
      chainId: 3,
      data: approveEncodedABI
    };
    return transactionObject;
  }

  sendTransaction = async () => {
    const ethAmountValidation = this.validateEthAmount();

    if (ethAmountValidation) {
      DebugUtilities.logInfo('validation successful');
      const transactionObject = await this.constructTransactionObject();
      await TransactionUtilities.sendOutgoingTransactionToServer(transactionObject);
      this.props.saveOutgoingDaiTransactionApproveAmount(this.web3.utils.toHex(-1));
      this.setModalVisible(false);
    } else {
      DebugUtilities.logInfo('validation failed!');
    }
  };

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  renderTransactionButtons() {
    if (this.props.cDaiLendingInfo.daiApproval) {
      return (
        <TransactionButtonContainer>
          <TransactionButton
            text="Withdraw"
            textColor="#000"
            backgroundColor="#FFF"
            borderColor="#FFF"
            iconColor="#1BA548"
            iconName="call-received"
            margin="8px 0"
            opacity="1"
            onPress={async () => {
              this.props.navigation.navigate('WithdrawDai');
            }}
          />
          <TransactionButton
            text="Supply"
            textColor="#000"
            backgroundColor="#FFF"
            borderColor="#FFF"
            iconColor="#F1860E"
            iconName="call-made"
            margin="8px 0"
            opacity="1"
            onPress={async () => {
              this.props.navigation.navigate('SupplyDai');
            }}
          />
        </TransactionButtonContainer>
      );
    }
    DebugUtilities.logInfo('dai not approved yet');
  }

  renderApproveButton() {
    if (!this.props.cDaiLendingInfo.daiApproval) {
      return (
        <Button
          text="Unlock Dai"
          textColor="#00A3E2"
          backgroundColor="#FFF"
          borderColor="#00A3E2"
          margin="40px auto"
          opacity="1"
          onPress={async () => {
            this.setModalVisible(true);
          }}
        />
      );
    }
    DebugUtilities.logInfo('dai already approved');
  }

  render() {
    const { balance, cDaiLendingInfo } = this.props;

    const RoundDownBigNumber = BigNumber.clone({
      DECIMAL_PLACES: 4,
      ROUNDING_MODE: BigNumber.ROUND_DOWN
    });

    const daiSavingsBalance = RoundDownBigNumber(balance.daiSavingsBalance)
      .div(new BigNumber(10).pow(36))
      .toString();

    const lifetimeEarnedInDai = RoundDownBigNumber(cDaiLendingInfo.lifetimeEarned)
      .div(new BigNumber(10).pow(36))
      .toString();

    return (
      <RootContainer>
        <HeaderOne marginTop="96">Dai</HeaderOne>
        <Modal
          animationType="fade"
          transparent
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}
        >
          <ModalContainer>
            <ModalBackground>
              <MondalInner>
                <ModalTextContainer>
                  <Description marginBottom="8" marginLeft="0" marginTop="16">
                    there will be about ${this.getTransactionFeeEstimateInUsd()} network fee to
                    unlock Dai.
                  </Description>
                </ModalTextContainer>
                <ButtonContainer>
                  <Button
                    text="Cancel"
                    textColor="#5F5F5F"
                    backgroundColor="#EEEEEE"
                    borderColor="#EEEEEE"
                    margin="8px"
                    opacity="1"
                    onPress={() => {
                      this.setModalVisible(false);
                      this.setState({ ethAmountValidation: undefined });
                    }}
                  />
                  <Button
                    text="Confirm"
                    textColor="white"
                    backgroundColor="#00A3E2"
                    borderColor="#00A3E2"
                    margin="8px"
                    opacity="1"
                    onPress={async () => {
                      await this.sendTransaction();
                      if (this.validateEthAmount()) {
                        this.props.navigation.navigate('History');
                      }
                    }}
                  />
                </ButtonContainer>
                <View>{this.renderInsufficientEthBalanceMessage()}</View>
              </MondalInner>
            </ModalBackground>
          </ModalContainer>
        </Modal>
        <UntouchableCardContainer
          alignItems="center"
          borderRadius="8"
          flexDirection="column"
          height="176px"
          justifyContent="center"
          marginTop="24px"
          textAlign="left"
          width="90%"
        >
          <HeaderFour marginTop="24">dai savings</HeaderFour>
          <BalanceText>{daiSavingsBalance} DAI</BalanceText>
          <DaiInterestEarnedTextContainer>
            <DaiInterestEarnedText>{lifetimeEarnedInDai} DAI</DaiInterestEarnedText>
            <Text> earned!</Text>
          </DaiInterestEarnedTextContainer>
        </UntouchableCardContainer>
        {this.renderTransactionButtons()}
        {this.renderApproveButton()}
      </RootContainer>
    );
  }
}

const ModalContainer = styled.View`
  background-color: rgba(0, 0, 0, 0.5);
  flex-direction: row;
  justify-content: center;
  height: 100%;
`;

const ModalBackground = styled.View`
  background-color: #fff;
  border-radius: 16px;
  height: 20%;
  min-height: 200px;
  margin-top: 200;
  width: 90%;
`;

const MondalInner = styled.View`
  justify-content: center;
  flex: 1;
  flex-direction: column;
  width: 100%;
`;

const ModalTextContainer = styled.View`
  margin: 0 auto;
  width: 90%;
`;

const ErrorMessage = styled.Text`
  color: #e41b13;
  font-family: 'HKGrotesk-Regular';
  text-align: center;
  width: 100%;
`;

const BalanceText = styled.Text`
  color: #000;
  font-family: 'HKGrotesk-Regular';
  font-size: 32;
`;

const DaiInterestEarnedTextContainer = styled.Text`
  font-family: 'HKGrotesk-Regular';
  margin-top: 16;
`;

const DaiInterestEarnedText = styled.Text`
  color: #1ba548;
  font-family: 'HKGrotesk-Regular';
  font-size: 18;
  font-weight: bold;
`;

const TransactionButtonContainer = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  margin: 0 auto;
  width: 90%;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  margin: 12px auto;
`;

function mapStateToProps(state) {
  return {
    balance: state.ReducerBalance.balance,
    gasPrice: state.ReducerGasPrice.gasPrice,
    cDaiLendingInfo: state.ReducerCDaiLendingInfo.cDaiLendingInfo,
    transactions: state.ReducerTransactionHistory.transactions
  };
}

const mapDispatchToProps = {
  getGasPriceAverage,
  saveDaiApprovalInfo,
  saveOutgoingDaiTransactionApproveAmount
};

export default withNavigation(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(EarnDai)
);
