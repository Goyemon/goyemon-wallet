'use strict';
import React, { Component } from 'react';
import { View, TextInput } from 'react-native';
import {
  RootContainer,
  Button,
  UntouchableCardContainer,
  HeaderOne,
  HeaderTwo
} from '../components/common';
import { connect } from 'react-redux';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { saveOutgoingTransactionObject } from '../actions/ActionOutgoingTransactionObjects';
import { getGasPriceFast, getGasPriceAverage, getGasPriceSlow } from '../actions/ActionGasPrice';
import PriceUtilities from '../utilities/PriceUtilities.js';
import TransactionUtilities from '../utilities/TransactionUtilities.ts';

class Send extends Component {
  constructor(props) {
    super();
    this.state = {
      gasPrice: [
        {
          speed: 'Fast',
          imageName: 'run-fast',
          gasPriceInWei: '0'
        },
        {
          speed: 'Average',
          imageName: 'run',
          gasPriceInWei: '0'
        },
        {
          speed: 'Slow',
          imageName: 'walk',
          gasPriceInWei: '0'
        }
      ],
      toAddress: '',
      amount: '',
      checked: 1,
      toAddressValidation: true,
      amountValidation: true
    };
  }

  componentDidMount() {
    this.props.getGasPriceFast();
    this.props.getGasPriceAverage();
    this.props.getGasPriceSlow();
  }

  getTransactionFeeEstimateInEther(gasPriceInWei) {
    const gasLimit = 21000;
    const transactionFeeEstimateInWei = gasPriceInWei * gasLimit;
    const transactionFeeEstimateInEther = this.props.web3.utils.fromWei(transactionFeeEstimateInWei.toString(), 'Ether');
    return transactionFeeEstimateInEther;
  }

  getTransactionFeeEstimateInUsd(gasPriceInWei) {
    return PriceUtilities.convertEthToUsd(this.getTransactionFeeEstimateInEther(gasPriceInWei));
  }

  async constructTransactionObject() {
    const transactionNonce = TransactionUtilities.getBiggestNonce() + 1;
    const amountInWei = parseFloat(this.props.web3.utils.toWei(this.state.amount, 'Ether'));
    const transactionObject = {
      nonce: `0x${transactionNonce.toString(16)}`,
      to: this.state.toAddress,
      value: `0x${amountInWei.toString(16)}`,
      gasPrice: `0x${this.state.gasPrice[this.state.checked].gasPriceInWei.toString(16)}`,
      gasLimit: `0x${parseFloat(21000).toString(16)}`,
      chainId: 3
    };
    return transactionObject;
  }

  validateToAddress(toAddress) {
    if (this.props.web3.utils.isAddress(toAddress)) {
      console.log('address validated!');
      this.setState({ toAddressValidation: true });
      return true;
    }
      console.log('invalid address');
      this.setState({ toAddressValidation: false });
      return false;
  }

  renderInvalidToAddressMessage() {
    if (this.state.toAddressValidation) {
      return;
    }
      return <ErrorMessage>invalid address!</ErrorMessage>;
  }

  validateAmount(amount) {
    const transactionFeeLimitInEther = getTransactionFeeEstimateInEther();

    if (
      parseFloat(amount) + parseFloat(transactionFeeLimitInEther) < parseFloat(this.props.balance.ethBalance) &&
      parseFloat(amount) >= 0 &&
      amount.length != 0
    ) {
      console.log('the amount validated!');
      this.setState({ amountValidation: true });
      return true;
    }
      console.log('wrong balance!');
      this.setState({ amountValidation: false });
      return false;
  }

  renderInsufficientBalanceMessage() {
    if (this.state.amountValidation) {
    } else {
      return <ErrorMessage>wrong balance!</ErrorMessage>;
    }
  }

  validateForm = async (toAddress, amount) => {
    const toAddressValidation = this.validateToAddress(toAddress);
    const amountValidation = this.validateAmount(amount);
    if (toAddressValidation && amountValidation) {
      const transactionObject = await this.constructTransactionObject();
      await this.props.saveOutgoingTransactionObject(transactionObject);
      this.props.navigation.navigate('Confirmation');
    } else {
      console.log('form validation failed!');
    }
  };

  render() {
    this.state.gasPrice[0].gasPriceInWei = this.props.gasPrice.fast;
    this.state.gasPrice[1].gasPriceInWei = this.props.gasPrice.average;
    this.state.gasPrice[2].gasPriceInWei = this.props.gasPrice.slow;

    return (
      <RootContainer>
        <HeaderOne marginTop="96">Send</HeaderOne>
        <UntouchableCardContainer
          alignItems="flex-start"
          borderRadius="8px"
          flexDirection="column"
          height="280px"
          justifyContent="flex-start"
          textAlign="left"
          width="95%"
        >
          <HeaderTwo color="#000" fontSize="16px" marginBottom="4" marginLeft="0" marginTop="0">
            TO
          </HeaderTwo>
          <TextInput
            style={this.state.toAddressValidation ? styles.noError : styles.error}
            placeholder="address"
            clearButtonMode="while-editing"
            onChangeText={toAddress => {
              this.validateToAddress(toAddress);
              this.setState({ toAddress });
            }}
          />
          <View>{this.renderInvalidToAddressMessage()}</View>
          <HeaderTwo color="#000" fontSize="16px" marginBottom="4" marginLeft="0" marginTop="24">
            AMOUNT(ETH)
          </HeaderTwo>
          <TextInput
            style={this.state.amountValidation ? styles.noError : styles.error}
            placeholder="type the amount of ether you would like to send"
            clearButtonMode="while-editing"
            onChangeText={amount => {
              this.validateAmount(amount);
              this.setState({ amount });
            }}
          />
          <View>{this.renderInsufficientBalanceMessage()}</View>
          <HeaderTwo color="#000" fontSize="16px" marginBottom="4" marginLeft="0" marginTop="24">
            NETWORK FEE
          </HeaderTwo>
          <NetworkFeeContainer>
            {this.state.gasPrice.map((gasPrice, key) => (
              <NetworkFee key={key}>
                {this.state.checked === key ? (
                  <SpeedContainer>
                    <SelectedButton>{gasPrice.speed}</SelectedButton>
                    <Icon name={gasPrice.imageName} size={40} color="#12BB4F" />
                    <SelectedButton>
                      ${this.getTransactionFeeEstimateInUsd(gasPrice.gasPriceInWei)}
                    </SelectedButton>
                  </SpeedContainer>
                ) : (
                  <SpeedContainer
                    onPress={() => {
                      this.setState({ checked: key });
                    }}
                  >
                    <UnselectedButton>{gasPrice.speed}</UnselectedButton>
                    <Icon name={gasPrice.imageName} size={40} color="#000" />
                    <UnselectedButton>
                      ${this.getTransactionFeeEstimateInUsd(gasPrice.gasPriceInWei)}
                    </UnselectedButton>
                  </SpeedContainer>
                )}
              </NetworkFee>
            ))}
          </NetworkFeeContainer>
        </UntouchableCardContainer>
        <ButtonWrapper>
          <Button
            text="Next"
            textColor="white"
            backgroundColor="#009DC4"
            margin="40px auto"
            opacity="1"
            onPress={async () => {
              await this.validateForm(this.state.toAddress, this.state.amount);
            }}
          />
        </ButtonWrapper>
      </RootContainer>
    );
  }
}

const styles = {
  noError: {
    borderBottomWidth: 2,
    borderBottomColor: '#EEE',
    fontSize: 18
  },
  error: {
    borderBottomWidth: 2,
    borderBottomColor: '#FF3346',
    fontSize: 18
  }
};

const NetworkFeeContainer = styled.View`
  alignItems: center;
  flexDirection: row;
  justifyContent: center;
`;

const NetworkFee = styled.View`
  margin-right: 24px;
`;

const SpeedContainer = styled.TouchableOpacity`
  alignItems: center;
  flexDirection: column;
  justifyContent: center;
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
    price: state.ReducerPrice.price,
    transactions: state.ReducerTransactionHistory.transactions
  };
}

const mapDispatchToProps = {
  saveOutgoingTransactionObject,
  getGasPriceFast,
  getGasPriceAverage,
  getGasPriceSlow
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Send);
