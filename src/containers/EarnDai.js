'use strict';
import BigNumber from 'bignumber.js';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Alert, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { withNavigation } from 'react-navigation';
import styled from 'styled-components';
import Web3 from 'web3';
import { saveDaiApprovalInfo } from '../actions/ActionCDaiLendingInfo';
import {
  getGasPriceFast,
  getGasPriceAverage,
  getGasPriceSlow,
  updateGasPriceChosen
} from '../actions/ActionGasPrice';
import { saveOutgoingDaiTransactionAmount, saveOutgoingDaiTransactionApproveAmount } from '../actions/ActionOutgoingDaiTransactionData';
import {
  RootContainer,
  UntouchableCardContainer,
  TransactionButton,
  HeaderOne,
  HeaderFour,
  Form,
  FormHeader,
  Button,
  Description,
  Loader
} from '../components/common/';
import LogUtilities from '../utilities/LogUtilities.js';
import PriceUtilities from '../utilities/PriceUtilities.js';
import TransactionUtilities from '../utilities/TransactionUtilities.ts';
import ABIEncoder from '../utilities/AbiUtilities';
import TxStorage from '../lib/tx.js';
const GlobalConfig = require('../config.json');

class EarnDai extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gasPrice: [
        {
          speed: 'fast',
          imageName: 'run-fast',
          gasPriceWei: '0'
        },
        {
          speed: 'average',
          imageName: 'run',
          gasPriceWei: '0'
        },
        {
          speed: 'slow',
          imageName: 'walk',
          gasPriceWei: '0'
        }
      ],
      ethBalance: Web3.utils.fromWei(props.balance.weiBalance),
      daiAmount: '',
      checked: props.gasPrice.chosen,
      modalVisible: false,
      daiAmountValidation: undefined,
      ethAmountValidation: undefined,
      currency: 'USD',
      loading: false,
      buttonDisabled: true,
      buttonOpacity: 0.5,
      showNetworkFee: false
    };
  }

  async componentDidMount() {
    this.props.getGasPriceFast();
    this.props.getGasPriceAverage();
    this.props.getGasPriceSlow();
    this.props.saveDaiApprovalInfo( await TxStorage.storage.isDAIApprovedForCDAI())
  }

  componentDidUpdate(prevProps) {
    //if (this.props.transactions != null && this.props.transactions.length != null) {
    //  if (this.props.transactions != prevProps.transactions) {
    //    this.props.saveDaiApprovalInfo(TransactionUtilities.isDaiApproved(this.props.transactions));
    //  }
    //}
    if (this.props.gasPrice != prevProps.gasPrice) {
      this.setState({ checked: this.props.gasPrice.chosen });
    }
    if (this.props.balance != prevProps.balance) {
      this.setState({ ethBalance: Web3.utils.fromWei(this.props.balance.weiBalance) });
    }
  }

  toggleCurrencySymbol() {
    if (this.state.currency === 'ETH') {
      return (
        <CurrencySymbol>
          <Text>ETH</Text>
          <Icon name="swap-horizontal" size={16} color="#5f5f5f" />
          <CurrencySymbolTextChosen>USD</CurrencySymbolTextChosen>
        </CurrencySymbol>
      );
    } else if (this.state.currency === 'USD') {
      return (
        <CurrencySymbol>
          <CurrencySymbolTextChosen>ETH</CurrencySymbolTextChosen>
          <Icon name="swap-horizontal" size={16} color="#5f5f5f" />
          <Text>USD</Text>
        </CurrencySymbol>
      );
    }
  }

  toggleCurrency(gasPriceWei) {
    if (this.state.currency === 'ETH') {
      const usdValue = this.getTransactionFeeEstimateInUsd(gasPriceWei);
      return <NetworkFeeText>${usdValue}</NetworkFeeText>;
    } else if (this.state.currency === 'USD') {
      let ethValue = this.getTransactionFeeEstimateInEth(gasPriceWei);
      ethValue = parseFloat(ethValue).toFixed(5);
      return <NetworkFeeText>{ethValue}ETH</NetworkFeeText>;
    }
  }

  getTransactionFeeEstimateInEth(gasPriceWei) {
    const approveTransactionFeeEstimateInEth =
      TransactionUtilities.getTransactionFeeEstimateInEther(gasPriceWei, 50000)
    ;
    const mintTransactionFeeEstimateInEth =
      TransactionUtilities.getTransactionFeeEstimateInEther(gasPriceWei, 350000)
    ;
    let transactionFeeEstimateInEth = parseFloat(approveTransactionFeeEstimateInEth) + parseFloat(mintTransactionFeeEstimateInEth);
    transactionFeeEstimateInEth = transactionFeeEstimateInEth.toFixed(4);
    return transactionFeeEstimateInEth;
  }

  getTransactionFeeEstimateInUsd(gasPriceWei) {
    const approveTransactionFeeEstimateInUsd = PriceUtilities.convertEthToUsd(
      TransactionUtilities.getTransactionFeeEstimateInEther(gasPriceWei, 50000)
    );
    const mintTransactionFeeEstimateInUsd = PriceUtilities.convertEthToUsd(
      TransactionUtilities.getTransactionFeeEstimateInEther(gasPriceWei, 350000)
    );
    let transactionFeeEstimateInUsd = parseFloat(approveTransactionFeeEstimateInUsd) + parseFloat(mintTransactionFeeEstimateInUsd);
    transactionFeeEstimateInUsd = transactionFeeEstimateInUsd.toFixed(4);
    return transactionFeeEstimateInUsd;
  }

  validateDaiAmount(daiAmount) {
    daiAmount = new BigNumber(10).pow(18).times(daiAmount);
    const daiBalance = new BigNumber(this.props.balance.daiBalance);

    if (
      daiBalance.isGreaterThanOrEqualTo(daiAmount) &&
      daiAmount.isGreaterThanOrEqualTo(0)
    ) {
      LogUtilities.logInfo('the dai amount validated!');
      this.setState({
        daiAmountValidation: true,
        buttonDisabled: false,
        buttonOpacity: 1
      });
      return true;
    }
    LogUtilities.logInfo('wrong dai balance!');
    this.setState({
      daiAmountValidation: false,
      buttonDisabled: true,
      buttonOpacity: 0.5
    });
    return false;
  }

  renderInsufficientDaiBalanceMessage() {
    if (
      this.state.daiAmountValidation ||
      this.state.daiAmountValidation === undefined
    ) {
    } else {
      return <ErrorMessage>invalid amount!</ErrorMessage>;
    }
  }

  validateEthAmount(gasPriceWei) {
    let approveTransactionFeeLimitInEther = TransactionUtilities.getTransactionFeeEstimateInEther(
      gasPriceWei,
      50000
    );
    let mintTransactionFeeLimitInEther = TransactionUtilities.getTransactionFeeEstimateInEther(
      gasPriceWei,
      350000
    );

    const ethBalance = new BigNumber(this.state.ethBalance);
    approveTransactionFeeLimitInEther = new BigNumber(approveTransactionFeeLimitInEther);
    mintTransactionFeeLimitInEther = new BigNumber(mintTransactionFeeLimitInEther);
    const transactionFeeLimitInEther = approveTransactionFeeLimitInEther.plus(mintTransactionFeeLimitInEther);

    if (ethBalance.isGreaterThan(transactionFeeLimitInEther)) {
      LogUtilities.logInfo('the eth amount validated!');
      this.setState({ ethAmountValidation: true });
      return true;
    }
    LogUtilities.logInfo('wrong eth balance!');
    this.setState({ ethAmountValidation: false });
    return false;
  }

  renderInsufficientEthBalanceMessage() {
    if (this.state.ethAmountValidation || this.state.ethAmountValidation === undefined) {
      return;
    }
    return <ErrorMessage>you don't have enough ether 😑</ErrorMessage>;
  }

  getAmountBorderColor() {
    if (this.state.daiAmountValidation === undefined) {
      return '#FFF';
    } else if (this.state.daiAmountValidation) {
      return '#1BA548';
    } else if (!this.state.daiAmountValidation) {
      return '#E41B13';
    }
  }

  getApproveEncodedABI() {
    const addressSpender = GlobalConfig.cDAIcontract;
    const amount = `0x${"ff".repeat(256/8)}`; // TODO: this needs to be a const somewhere, likely uint256max_hex.

    const approveEncodedABI = ABIEncoder.encodeApprove(addressSpender, amount);

    return approveEncodedABI;
  }

  async constructApproveTransactionObject() { // TODO: this has to be in TransactionUtilities. it's common code for the most part anyway. chainid, nonce, those are always set the same way. we just need to specify to/gas/data/value and that's across ALL txes sent
    const approveEncodedABI = this.getApproveEncodedABI();
    const transactionObject = (await TxStorage.storage.newTx())
      .setTo(GlobalConfig.DAIcontract)
      .setGasPrice(this.props.gasPrice.average.toString(16))
      .setGas((50000).toString(16))
      .tempSetData(approveEncodedABI)
      .addTokenOperation('dai', TxStorage.TxTokenOpTypeToName.approval, [GlobalConfig.cDAIcontract, this.state.checksumAddress, "ff".repeat(256/8)]);

    return transactionObject;
  }

  async constructMintTransactionObject() {
    const mintEncodedABI = ABIEncoder.encodeCDAIMint(this.state.daiAmount);
    const transactionObject = (await TxStorage.storage.newTx())
      .setTo(GlobalConfig.cDAIcontract)
      .setGasPrice(this.state.gasPrice[this.state.checked].gasPriceWei.toString(16))
      .setGas((350000).toString(16))
      .tempSetData(mintEncodedABI)
      .addTokenOperation('cdai', TxStorage.TxTokenOpTypeToName.mint, [this.state.checksumAddress, this.state.daiAmount, 0]);

    return transactionObject;
  }

  sendTransactions = async daiAmount => {
    const daiAmountValidation = this.validateDaiAmount(daiAmount);
    const ethAmountValidation = this.validateEthAmount(this.state.gasPrice[this.state.checked].gasPriceWei);
    const isOnline = this.props.netInfo;

    if (daiAmountValidation && ethAmountValidation && isOnline) {
      this.setState({ loading: true, buttonDisabled: true });
      LogUtilities.logInfo('validation successful');
      const approveTransactionObject = await this.constructApproveTransactionObject();
      await TransactionUtilities.sendOutgoingTransactionToServer(approveTransactionObject);
      this.props.saveOutgoingDaiTransactionApproveAmount(Web3.utils.toHex(-1));
      const mintTransactionObject = await this.constructMintTransactionObject();
      await TransactionUtilities.sendOutgoingTransactionToServer(mintTransactionObject);
      this.props.saveOutgoingDaiTransactionAmount(daiAmount);
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
            this.validateEthAmount(this.state.gasPrice[this.state.checked].gasPriceWei);
          }}
        />
      );
    }
    LogUtilities.logInfo('dai already approved');
  }

  renderIsOnlineMessage() {
    if (this.props.netInfo) {
      return;
    }
    return <ErrorMessage>you are offline 😟</ErrorMessage>;
  }

  renderNetworkFeeContainer() {
    if (this.state.showNetworkFee) {
      return (
        <Container>
          <NetworkFeeHeaderContainer>
            <FormHeader marginBottom="0" marginLeft="0" marginTop="0">
              Network Fee
            </FormHeader>
            <NetworkFeeSymbolContainer
              onPress={() => {
                if (this.state.currency === 'ETH') {
                  this.setState({ currency: 'USD' });
                } else if (this.state.currency === 'USD') {
                  this.setState({ currency: 'ETH' });
                }
              }}
            >
              {this.toggleCurrencySymbol()}
            </NetworkFeeSymbolContainer>
          </NetworkFeeHeaderContainer>
          <UntouchableCardContainer
            alignItems="center"
            borderRadius="0"
            flexDirection="column"
            height="120px"
            justifyContent="flex-start"
            marginTop="16"
            textAlign="left"
            width="80%"
          >
            <NetworkFeeContainer>
              {this.state.gasPrice.map((gasPrice, key) => (
                <NetworkFee key={key}>
                  {this.state.checked === key ? (
                    <SpeedContainer>
                      <SelectedButton>{gasPrice.speed}</SelectedButton>
                      <Icon
                        name={gasPrice.imageName}
                        size={40}
                        color="#1BA548"
                      />
                      <SelectedButton>
                        {this.toggleCurrency(gasPrice.gasPriceWei)}
                      </SelectedButton>
                    </SpeedContainer>
                  ) : (
                    <SpeedContainer
                      onPress={() => {
                        this.setState({ checked: key });
                        this.props.updateGasPriceChosen(key);
                        this.validateEthAmount(gasPrice.gasPriceWei);
                      }}
                    >
                      <UnselectedButton>{gasPrice.speed}</UnselectedButton>
                      <Icon name={gasPrice.imageName} size={40} color="#000" />
                      <UnselectedButton>
                        {this.toggleCurrency(gasPrice.gasPriceWei)}
                      </UnselectedButton>
                    </SpeedContainer>
                  )}
                </NetworkFee>
              ))}
            </NetworkFeeContainer>
          </UntouchableCardContainer>
          <MenuUpContainer>
            <Icon
              name="menu-up"
              color="#000"
              onPress={() => {
                this.setState({ showNetworkFee: false });
              }}
              size={32}
            />
          </MenuUpContainer>
        </Container>
      );
    } else if (!this.state.showNetworkFee) {
      return (
        <MenuUpContainer>
          <Icon
            name="menu-down"
            color="#000"
            onPress={() => {
              this.setState({ showNetworkFee: true });
            }}
            size={32}
          />
        </MenuUpContainer>
      );
    }
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

    this.state.gasPrice[0].gasPriceWei = this.props.gasPrice.fast;
    this.state.gasPrice[1].gasPriceWei = this.props.gasPrice.average;
    this.state.gasPrice[2].gasPriceWei = this.props.gasPrice.slow;

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
                borderColor={this.getAmountBorderColor()}
                borderWidth={1}
                height="56px"
              >
                <SendTextInputContainer>
                  <SendTextInput
                    placeholder="amount"
                    keyboardType="numeric"
                    clearButtonMode="while-editing"
                    onChangeText={daiAmount => {
                      this.validateDaiAmount(daiAmount);
                      this.setState({ daiAmount });
                    }}
                    returnKeyType="done"
                  />
                  <CurrencySymbolText>DAI</CurrencySymbolText>
                </SendTextInputContainer>
              </Form>
              <View>{this.renderInsufficientDaiBalanceMessage()}</View>
              {this.renderNetworkFeeContainer()}
              <View>{this.renderInsufficientEthBalanceMessage()}</View>
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
                      this.setState({ daiAmountValidation: undefined, ethAmountValidation: undefined });
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
                <Loader animating={this.state.loading} />
                <View>{this.renderIsOnlineMessage()}</View>
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

const Container = styled.View`
  align-items: center;
  flex-direction: column;
  justify-content: center;
`;

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

const MenuUpContainer = styled.View`
  align-items: center;
  flex-direction: column;
  justify-content: center;
  margin: 0 8px;
`;

const NetworkFeeHeaderContainer = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: center;
  margin-top: 24;
`;

const NetworkFeeSymbolContainer = styled.TouchableWithoutFeedback``;

const NetworkFeeContainer = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: center;
  width: 100%;
`;

const NetworkFee = styled.View`
  margin: 0 4px;
  width: 33.3%;
`;

const NetworkFeeText = styled.Text`
  font-family: 'HKGrotesk-Regular';
  font-size: 12;
`;

const CurrencySymbol = styled.Text`
  font-family: 'HKGrotesk-Regular';
  font-size: 16;
  margin-left: 8;
`;

const CurrencySymbolTextChosen = styled.Text`
  color: #1ba548;
`;

const SpeedContainer = styled.TouchableOpacity`
  align-items: center;
  flex-direction: column;
  justify-content: center;
  margin: 0 8px;
`;

const SelectedButton = styled.Text`
  color: #1ba548;
  font-family: 'HKGrotesk-Regular';
`;

const UnselectedButton = styled.Text`
  color: #000;
  font-family: 'HKGrotesk-Regular';
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
  getGasPriceAverage,
  saveDaiApprovalInfo,
  saveOutgoingDaiTransactionAmount,
  saveOutgoingDaiTransactionApproveAmount,
  getGasPriceFast,
  getGasPriceAverage,
  getGasPriceSlow,
  updateGasPriceChosen
};

export default withNavigation(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(EarnDai)
);
