'use strict';
import BigNumber from 'bignumber.js';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Alert, View, Text } from 'react-native';
import { withNavigation } from 'react-navigation';
import styled from 'styled-components';
import Web3 from 'web3';
import { saveDaiApprovalInfo } from '../actions/ActionCDaiLendingInfo';
import {
  updateGasPriceChosen
} from '../actions/ActionGasPrice';
import {
  RootContainer,
  UntouchableCardContainer,
  TransactionButton,
  HeaderOne,
  HeaderFour,
  Form,
  Button,
  Description,
  Loader,
  IsOnlineMessage,
  InsufficientEthBalanceMessage,
  InsufficientDaiBalanceMessage
} from '../components/common/';
import NetworkFeeContainer from '../containers/NetworkFeeContainer';
import LogUtilities from '../utilities/LogUtilities.js';
import StyleUtilities from '../utilities/StyleUtilities.js';
import TransactionUtilities from '../utilities/TransactionUtilities.ts';
import ABIEncoder from '../utilities/AbiUtilities';
import TxStorage from '../lib/tx.js';
import GlobalConfig from '../config.json';

class SaveDai extends Component {
  constructor(props) {
    super(props);
    this.state = {
      daiAmount: '',
      modalVisible: false,
      daiAmountValidation: undefined,
      weiAmountValidation: undefined,
      loading: false,
      buttonDisabled: true,
      buttonOpacity: 0.5,
    };
  }

  async componentDidMount() {
    if(this.props.cDaiLendingInfo.daiApproval != true){
      this.props.saveDaiApprovalInfo( await TxStorage.storage.isDAIApprovedForCDAI());
    }
    this.updateWeiAmountValidation(TransactionUtilities.validateWeiAmountForTransactionFee(TransactionUtilities.returnTransactionSpeed(this.props.gasPrice.chosen), GlobalConfig.ERC20ApproveGasLimit + GlobalConfig.cTokenMintGasLimit));
  }

  async componentDidUpdate(prevProps) {
    if(this.props.cDaiLendingInfo.daiApproval != true){
      if (this.props.transactions != prevProps.transactions) {
        this.props.saveDaiApprovalInfo(await TxStorage.storage.isDAIApprovedForCDAI());
      } 
    }
  }

  updateDaiAmountValidation(daiAmountValidation) {
    if(daiAmountValidation) {
      this.setState({
        daiAmountValidation: true,
        buttonDisabled: false,
        buttonOpacity: 1
      });
    } else if (!daiAmountValidation) {
      this.setState({
        daiAmountValidation: false,
        buttonDisabled: true,
        buttonOpacity: 0.5
      });  
    }
  }

  updateWeiAmountValidation(weiAmountValidation) {
    if(weiAmountValidation) {
      this.setState({ weiAmountValidation: true });
    } else if (!weiAmountValidation) {
      this.setState({ weiAmountValidation: false });
    }
  }

  getApproveEncodedABI() {
    const addressSpender = GlobalConfig.cDAIcontract;
    const amount = `0x${"ff".repeat(256/8)}`; // TODO: this needs to be a const somewhere, likely uint256max_hex.

    const approveEncodedABI = ABIEncoder.encodeApprove(addressSpender, amount, 0);

    return approveEncodedABI;
  }

  async constructApproveTransactionObject() { // TODO: this has to be in TransactionUtilities. it's common code for the most part anyway. chainid, nonce, those are always set the same way. we just need to specify to/gas/data/value and that's across ALL txes sent
    const approveEncodedABI = this.getApproveEncodedABI();
    const transactionObject = (await TxStorage.storage.newTx())
      .setTo(GlobalConfig.DAITokenContract)
      .setGasPrice(this.props.gasPrice.average.toString(16))
      .setGas((GlobalConfig.ERC20ApproveGasLimit).toString(16))
      .tempSetData(approveEncodedABI)
      .addTokenOperation('dai', TxStorage.TxTokenOpTypeToName.approval, [GlobalConfig.cDAIcontract, TxStorage.storage.getOwnAddress(), "ff".repeat(256/8)]);

    return transactionObject;
  }

  async constructMintTransactionObject() {
    const mintEncodedABI = ABIEncoder.encodeCDAIMint(this.state.daiAmount);

    const daiAmountWithDecimals = new BigNumber(this.state.daiAmount).times(new BigNumber(10).pow(18)).toString(16);

    const transactionObject = (await TxStorage.storage.newTx())
      .setTo(GlobalConfig.cDAIcontract)
      .setGasPrice(TransactionUtilities.returnTransactionSpeed(this.props.gasPrice.chosen).toString(16))
      .setGas((GlobalConfig.cTokenMintGasLimit).toString(16))
      .tempSetData(mintEncodedABI)
      .addTokenOperation('cdai', TxStorage.TxTokenOpTypeToName.mint, [TxStorage.storage.getOwnAddress(), daiAmountWithDecimals, 0]);

    return transactionObject;
  }

  sendTransactions = async daiAmount => {
    const daiAmountValidation = TransactionUtilities.validateDaiAmount(daiAmount);
    const weiAmountValidation = TransactionUtilities.validateWeiAmountForTransactionFee(TransactionUtilities.returnTransactionSpeed(this.props.gasPrice.chosen), GlobalConfig.ERC20ApproveGasLimit + GlobalConfig.cTokenMintGasLimit);
    const isOnline = this.props.netInfo;

    if (daiAmountValidation && weiAmountValidation && isOnline) {
      this.setState({ loading: true, buttonDisabled: true });
      LogUtilities.logInfo('validation successful');
      const approveTransactionObject = await this.constructApproveTransactionObject();
      await TransactionUtilities.sendOutgoingTransactionToServer(approveTransactionObject);
      const mintTransactionObject = await this.constructMintTransactionObject();
      await TransactionUtilities.sendOutgoingTransactionToServer(mintTransactionObject);
      this.setModalVisible(false);
      this.props.navigation.navigate('History');
    } else {
      LogUtilities.logInfo('form validation failed!');
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
            text="Deposit"
            textColor="#000"
            backgroundColor="#FFF"
            borderColor="#FFF"
            iconColor="#F1860E"
            iconName="call-made"
            margin="8px 0"
            opacity="1"
            onPress={async () => {
              this.props.navigation.navigate('DepositDai');
            }}
          />
        </TransactionButtonContainer>
      );
    }
    LogUtilities.logInfo('dai not approved yet');
  }

  renderApproveButton() {
    if (!this.props.cDaiLendingInfo.daiApproval) {
      return (
        <Button
          text="Deposit Your First Dai!"
          textColor="#00A3E2"
          backgroundColor="#FFF"
          borderColor="#00A3E2"
          margin="40px auto"
          marginBottom="12px"
          opacity="1"
          onPress={async () => {
            this.setModalVisible(true);
            this.updateWeiAmountValidation(TransactionUtilities.validateWeiAmountForTransactionFee(TransactionUtilities.returnTransactionSpeed(this.props.gasPrice.chosen), GlobalConfig.ERC20ApproveGasLimit + GlobalConfig.cTokenMintGasLimit));
          }}
        />
      );
    }
    LogUtilities.logInfo('dai already approved');
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

    const daiBalance = RoundDownBigNumber(this.props.balance.daiBalance)
      .div(new BigNumber(10).pow(18))
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
              <UntouchableCardContainer
                alignItems="center"
                borderRadius="8px"
                flexDirection="column"
                height="160px"
                justifyContent="center"
                marginTop="0"
                textAlign="center"
                width="80%"
              >
                <CoinImage source={require('../../assets/dai_icon.png')} />
                <Title>dai wallet balance</Title>
                <BalanceContainer>
                  <Value>{daiBalance} DAI</Value>
                </BalanceContainer>
              </UntouchableCardContainer>
              <Description marginBottom="8" marginLeft="8" marginTop="32">
              how much do you want to deposit?
              </Description>
              <Form
                borderColor={StyleUtilities.getBorderColor(this.state.daiAmountValidation)}
                borderWidth={1}
                height="56px"
              >
                <SendTextInputContainer>
                  <SendTextInput
                    placeholder="amount"
                    keyboardType="numeric"
                    clearButtonMode="while-editing"
                    onChangeText={daiAmount => {
                      this.updateDaiAmountValidation(TransactionUtilities.validateDaiAmount(daiAmount));
                      this.setState({ daiAmount });
                    }}
                    returnKeyType="done"
                  />
                  <CurrencySymbolText>DAI</CurrencySymbolText>
                </SendTextInputContainer>
              </Form>
              <InsufficientDaiBalanceMessage daiAmountValidation={this.state.daiAmountValidation} />
              <NetworkFeeContainer gasLimit={GlobalConfig.ERC20ApproveGasLimit + GlobalConfig.cTokenMintGasLimit} />
              <InsufficientEthBalanceMessage weiAmountValidation={this.state.weiAmountValidation} />
                <ButtonContainer>
                  <Button
                    text="Cancel"
                    textColor="#5F5F5F"
                    backgroundColor="#EEEEEE"
                    borderColor="#EEEEEE"
                    margin="8px"
                    marginBottom="12px"
                    opacity="1"
                    onPress={() => {
                      this.setModalVisible(false);
                      this.setState({ daiAmountValidation: undefined, weiAmountValidation: undefined });
                    }}
                  />
                  <Button
                    text="Deposit"
                    textColor="white"
                    backgroundColor="#00A3E2"
                    borderColor="#00A3E2"
                    disabled={this.state.buttonDisabled}
                    margin="8px"
                    marginBottom="12px"
                    opacity={this.state.buttonOpacity}
                    onPress={async () => {
                      await this.sendTransactions(this.state.daiAmount);
                      this.setState({ loading: false, buttonDisabled: false });
                    }}
                  />
                </ButtonContainer>
                <Loader animating={this.state.loading} size="small"/>
                <IsOnlineMessage netInfo={this.props.netInfo} />
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

const ModalBackground = styled.ScrollView`
  background-color: #f8f8f8;
  border-radius: 16px;
  height: 90%;
  min-height: 400px;
  margin-top: 40;
  width: 90%;
`;

const MondalInner = styled.View`
  align-items: center;
  justify-content: center;
  flex: 1;
  flex-direction: column;
  margin-top: 40;
  width: 100%;
`;

const SendTextInputContainer = styled.View`
  align-items: center;
  flex-direction: row;
  height: 100%;
  width: 95%;
`;

const SendTextInput = styled.TextInput`
  font-size: 14;
  height: 56px;
  width: 95%;
  text-align: left;
`;

const CoinImage = styled.Image`
  border-radius: 20px;
  height: 40px;
  margin-top: 16px;
  width: 40px;
`;

const Title = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  font-size: 16;
  margin-top: 16px;
  text-transform: uppercase;
`;

const BalanceContainer = styled.View`
  align-items: center;
  flex-direction: row;
  margin-top: 8px;
`;

const Value = styled.Text`
  font-family: 'HKGrotesk-Regular';
  font-size: 16;
  margin-left: 4;
`;

const CurrencySymbolText = styled.Text`
  font-family: 'HKGrotesk-Regular';
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
  margin: 0 auto;
`;

function mapStateToProps(state) {
  return {
    balance: state.ReducerBalance.balance,
    gasPrice: state.ReducerGasPrice.gasPrice,
    cDaiLendingInfo: state.ReducerCDaiLendingInfo.cDaiLendingInfo,
    netInfo: state.ReducerNetInfo.netInfo,
  };
}

const mapDispatchToProps = {
  saveDaiApprovalInfo,
  updateGasPriceChosen
};

export default withNavigation(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SaveDai)
);
