'use strict';
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import {
  RootContainer,
  Button,
  UntouchableCardContainer,
  HeaderOne,
  HeaderTwo,
  Form,
  FormHeader
} from '../components/common';
import { connect } from 'react-redux';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { saveOutgoingTransactionObject } from '../actions/ActionOutgoingTransactionObjects';
import {
  saveTransactionFeeEstimateUsd,
  saveTransactionFeeEstimateEth
} from '../actions/ActionTransactionFeeEstimate';
import { saveDaiAmount } from '../actions/ActionDaiAmount';
import { saveDaiToAddress } from '../actions/ActionDaiToAddress';
import { getGasPriceFast, getGasPriceAverage, getGasPriceSlow } from '../actions/ActionGasPrice';
import PriceUtilities from '../utilities/PriceUtilities.js';
import TransactionUtilities from '../utilities/TransactionUtilities.ts';
import GasUtilities from '../utilities/GasUtilities.js';
import Animation from 'lottie-react-native';
import daiToken from '../contracts/DaiToken';

class SendDai extends Component {
  constructor(props) {
    super();
    this.state = {
      gasPrice: [
        {
          speed: 'fast',
          imageName: 'run-fast',
          gasPriceInWei: '0'
        },
        {
          speed: 'average',
          imageName: 'run',
          gasPriceInWei: '0'
        },
        {
          speed: 'slow',
          imageName: 'walk',
          gasPriceInWei: '0'
        }
      ],
      toAddress: '',
      amount: '',
      checked: 1,
      toAddressValidation: undefined,
      daiAmountValidation: undefined,
      ethAmountValidation: undefined,
      currency: 'USD'
    };
  }

  componentDidMount() {
    this.props.getGasPriceFast();
    this.props.getGasPriceAverage();
    this.props.getGasPriceSlow();
  }

  getUsdBalance() {
    try {
      return PriceUtilities.convertDaiToUsd(this.props.balance.daiBalance);
    } catch (err) {
      console.error(err);
    }
  }

  toggleCurrencySymbol() {
    if (this.state.currency === 'ETH') {
      return <CurrencySymbol>ETH</CurrencySymbol>;
    } else if (this.state.currency === 'USD') {
      return <CurrencySymbol>$</CurrencySymbol>;
    }
  }

  toggleCurrency(gasPriceInWei) {
    if (this.state.currency === 'ETH') {
      const usdValue = this.getTransactionFeeEstimateInUsd(gasPriceInWei);
      return <Text>${usdValue}</Text>;
    } else if (this.state.currency === 'USD') {
      const ethValue = GasUtilities.getTransactionFeeEstimateInEther(gasPriceInWei, 100000);
      return <NetworkFeeInEther>{ethValue}ETH</NetworkFeeInEther>;
    }
  }

  getTransactionFeeEstimateInUsd(gasPriceInWei) {
    return PriceUtilities.convertEthToUsd(
      GasUtilities.getTransactionFeeEstimateInEther(gasPriceInWei, 100000)
    );
  }

  getTransferEncodedABI(address, amount) {
    const daiTokenContract = new this.props.web3.eth.Contract(
      JSON.parse(daiToken.daiTokenAbi),
      daiToken.daiTokenAddress
    );

    const amountWithDecimals = amount * 10 ** 18;

    const transferEncodedABI = daiTokenContract.methods.transfer(address, amountWithDecimals).encodeABI();
    return transferEncodedABI;
  }

  async constructTransactionObject() {
    const transactionNonce = TransactionUtilities.getBiggestNonce() + 1;
    const transferEncodedABI = this.getTransferEncodedABI(this.state.toAddress, this.state.amount);
    const transactionObject = {
      nonce: `0x${transactionNonce.toString(16)}`,
      to: daiToken.daiTokenAddress,
      gasPrice: `0x${this.state.gasPrice[this.state.checked].gasPriceInWei.toString(16)}`,
      gasLimit: `0x${parseFloat(100000).toString(16)}`,
      chainId: 3,
      data: transferEncodedABI
    };
    return transactionObject;
  }

  validateToAddress(toAddress) {
    if (this.props.web3.utils.isAddress(toAddress)) {
      console.log('address validated!');
      this.setState({ toAddressValidation: true });
      return true;
    } else if (!this.state.toAddressValidation) {
      console.log('invalid address');
      this.setState({ toAddressValidation: false });
      return false;
    }
  }

  renderInvalidToAddressMessage() {
    if (this.state.toAddressValidation || this.state.toAddressValidation === undefined) {
      return;
    } else if (!this.state.toAddressValidation) {
      return <ErrorMessage>invalid address!</ErrorMessage>;
    }
  }

  validateDaiAmount(amount) {
    if (
      parseFloat(this.props.balance.daiBalance) > parseFloat(amount) &&
      parseFloat(amount) >= 0 &&
      amount.length != 0
    ) {
      console.log('the dai amount validated!');
      this.setState({ daiAmountValidation: true });
      return true;
    }
    console.log('wrong dai balance!');
    this.setState({ daiAmountValidation: false });
    return false;
  }

  validateEthAmount() {
    const transactionFeeLimitInEther = GasUtilities.getTransactionFeeEstimateInEther(
      this.state.gasPrice[this.state.checked].gasPriceInWei,
      100000
    );

    if (parseFloat(this.props.balance.ethBalance) > parseFloat(transactionFeeLimitInEther)) {
      console.log('the eth amount validated!');
      this.setState({ ethAmountValidation: true });
      return true;
    }
    console.log('wrong eth balance!');
    this.setState({ ethAmountValidation: false });
    return false;
  }

  renderInsufficientDaiBalanceMessage() {
    if (this.state.daiAmountValidation || this.state.daiAmountValidation === undefined) {
      // let animationCheckedDone;
      // return (
      //   <Animation
      //     ref={(animation) => animationCheckedDone = animation}
      //     loop={false}
      //     source="require('../../assets/checked_done.json')"
      //   />
      // );
      // animationCheckedDone.play();
    } else {
      return <ErrorMessage>not enough dai!</ErrorMessage>;
    }
  }

  renderInsufficientEthBalanceMessage() {
    if (this.state.ethAmountValidation || this.state.ethAmountValidation === undefined) {
      // let animationCheckedDone;
      // return (
      //   <Animation
      //     ref={(animation) => animationCheckedDone = animation}
      //     loop={false}
      //     source="require('../../assets/checked_done.json')"
      //   />
      // );
      // animationCheckedDone.play();
    } else {
      return <ErrorMessage>not enough ether!</ErrorMessage>;
    }
  }

  getAmountBorderColor() {
    if (this.state.daiAmountValidation === undefined) {
      return '#FFF';
    } else if (this.state.daiAmountValidation) {
      return '#12BB4F';
    } else if (!this.state.daiAmountValidation) {
      return '#FF3346';
    }
  }

  getToAddressBorderColor() {
    if (this.state.toAddressValidation === undefined) {
      return '#FFF';
    } else if (this.state.toAddressValidation) {
      return '#12BB4F';
    } else if (!this.state.toAddressValidation) {
      return '#FF3346';
    }
  }

  validateForm = async (toAddress, amount) => {
    const toAddressValidation = this.validateToAddress(toAddress);
    const daiAmountValidation = this.validateDaiAmount(amount);
    const ethAmountValidation = this.validateEthAmount();

    if (toAddressValidation && daiAmountValidation && ethAmountValidation) {
      console.log('validation successful');
      const transactionObject = await this.constructTransactionObject();
      await this.props.saveOutgoingTransactionObject(transactionObject);
      await this.props.saveDaiAmount(amount);
      await this.props.saveDaiToAddress(toAddress);
      this.props.navigation.navigate('ConfirmationDai');
    } else {
      console.log('form validation failed!');
    }
  };

  render() {
    const { balance } = this.props;

    this.state.gasPrice[0].gasPriceInWei = this.props.gasPrice.fast;
    this.state.gasPrice[1].gasPriceInWei = this.props.gasPrice.average;
    this.state.gasPrice[2].gasPriceInWei = this.props.gasPrice.slow;

    this.props.saveTransactionFeeEstimateEth(
      GasUtilities.getTransactionFeeEstimateInEther(
        this.state.gasPrice[this.state.checked].gasPriceInWei,
        100000
      )
    );
    this.props.saveTransactionFeeEstimateUsd(
      PriceUtilities.convertEthToUsd(
        GasUtilities.getTransactionFeeEstimateInEther(
          this.state.gasPrice[this.state.checked].gasPriceInWei,
          100000
        )
      )
    );

    return (
      <RootContainer>
        <HeaderOne marginTop="96">Send</HeaderOne>
        <Container>
          <UntouchableCardContainer
            alignItems="center"
            borderRadius="8px"
            flexDirection="column"
            height="200px"
            justifyContent="center"
            marginTop="56"
            textAlign="center"
            width="80%"
          >
            <CoinImage source={require('../../assets/dai_icon.png')} />
            <BalanceText>your dai balance</BalanceText>
            <UsdBalance>${this.getUsdBalance()}</UsdBalance>
            <EthBalance>{balance.daiBalance} DAI</EthBalance>
          </UntouchableCardContainer>
          <FormHeader marginBottom="4" marginLeft="0" marginTop="0">
            To
          </FormHeader>
          <Form borderColor={this.getToAddressBorderColor()} borderWidth={1} height="56px">
          <SendTextInputContainer>
              <SendTextInput
                placeholder="address"
                clearButtonMode="while-editing"
                onChangeText={toAddress => {
                  this.validateToAddress(toAddress);
                  this.setState({ toAddress });
                }}
              />
            </SendTextInputContainer>
          </Form>
          <View>{this.renderInvalidToAddressMessage()}</View>
          <FormHeader marginBottom="4" marginLeft="0" marginTop="24">
            Amount
          </FormHeader>
          <Form borderColor={this.getAmountBorderColor()} borderWidth={1} height="56px">
            <SendTextInputContainer>
              <SendTextInput
                placeholder="0"
                clearButtonMode="while-editing"
                onChangeText={amount => {
                  this.validateDaiAmount(amount);
                  this.setState({ amount });
                }}
              />
              <Text>DAI</Text>
            </SendTextInputContainer>
          </Form>
          <View>{this.renderInsufficientDaiBalanceMessage()}</View>
          <FormHeader marginBottom="4" marginLeft="0" marginTop="24">
            Network Fee
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
          </FormHeader>
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
                      <Icon name={gasPrice.imageName} size={40} color="#12BB4F" />
                      <SelectedButton>{this.toggleCurrency(gasPrice.gasPriceInWei)}</SelectedButton>
                    </SpeedContainer>
                  ) : (
                    <SpeedContainer
                      onPress={() => {
                        this.validateEthAmount();
                        this.setState({ checked: key });
                      }}
                    >
                      <UnselectedButton>{gasPrice.speed}</UnselectedButton>
                      <Icon name={gasPrice.imageName} size={40} color="#000" />
                      <UnselectedButton>
                        {this.toggleCurrency(gasPrice.gasPriceInWei)}
                      </UnselectedButton>
                    </SpeedContainer>
                  )}
                </NetworkFee>
              ))}
            </NetworkFeeContainer>
          </UntouchableCardContainer>
          <View>{this.renderInsufficientEthBalanceMessage()}</View>
          <ButtonWrapper>
            <Button
              text="Next"
              textColor="#009DC4"
              backgroundColor="#FFF"
              borderColor="#009DC4"
              margin="40px auto"
              opacity="1"
              onPress={async () => {
                await this.validateForm(this.state.toAddress, this.state.amount);
              }}
            />
          </ButtonWrapper>
        </Container>
      </RootContainer>
    );
  }
}

const Container = styled.View`
  alignItems: center;
  flexDirection: column;
  justifyContent: center;
`;

const SendTextInputContainer = styled.View`
  alignItems: center;
  flexDirection: row;
  height: 100%;
  width: 95%;
`;

const SendTextInput = styled.TextInput`
  font-size: 16px;
  height: 56px;
  width: 95%;
  text-align: left;
`;

const CoinImage = styled.Image`
  border-radius: 20px;
  height: 40px;
  width: 40px;
`;

const BalanceText = styled.Text`
  color: #5f5f5f;
  font-size: 24px;
  margin-top: 16px;
  text-transform: uppercase;
`;

const UsdBalance = styled.Text`
  font-size: 28px;
  margin-top: 8px;
`;

const EthBalance = styled.Text`
  font-size: 16px;
`;

const NetworkFeeSymbolContainer = styled.TouchableWithoutFeedback`
  margin-left: 8px;
`;

const NetworkFeeContainer = styled.View`
  alignItems: center;
  flexDirection: row;
  justifyContent: center;
`;

const NetworkFee = styled.View`
  margin: 0 8px;
`;

const NetworkFeeInEther = styled.Text`
  font-size: 12px;
`;

const CurrencySymbol = styled.Text`
  font-size: 20px;
`;

const SpeedContainer = styled.TouchableOpacity`
  alignItems: center;
  flexDirection: column;
  justifyContent: center;
  margin: 0 8px;
`;

const SelectedButton = styled.Text`
  color: #12bb4f;
`;

const UnselectedButton = styled.Text`
  color: #000;
`;

const ButtonWrapper = styled.View`
  alignItems: center;
`;

const ErrorMessage = styled.Text`
  color: #ff3346;
`;

function mapStateToProps(state) {
  return {
    checksumAddress: state.ReducerChecksumAddress.checksumAddress,
    gasPrice: state.ReducerGasPrice.gasPrice,
    web3: state.ReducerWeb3.web3,
    balance: state.ReducerBalance.balance,
    transactions: state.ReducerTransactionHistory.transactions
  };
}

const mapDispatchToProps = {
  saveOutgoingTransactionObject,
  saveTransactionFeeEstimateUsd,
  saveTransactionFeeEstimateEth,
  saveDaiAmount,
  saveDaiToAddress,
  getGasPriceFast,
  getGasPriceAverage,
  getGasPriceSlow
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SendDai);
