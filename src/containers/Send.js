'use strict';
import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { RootContainer, Button, UntouchableCardContainer, HeaderOne, HeaderTwo } from '../components/common';
import { connect } from 'react-redux';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { saveOutgoingTransactionObject } from '../actions/ActionOutgoingTransactionObjects';
import { getGasPriceFast, getGasPriceAverage, getGasPriceSlow } from '../actions/ActionGasPrice';

class Send extends Component {
  constructor(props) {
    super();
    this.state = {
      gasPrice: [
        {
          speed: "Fast",
          imageName: "run-fast",
          gasPriceInEther: "0"
        },
        {
          speed: "Average",
          imageName: "run",
          gasPriceInEther: "0"
        },
        {
          speed: "Slow",
          imageName: "walk",
          gasPriceInEther: "0"
        }
      ],
      toAddress: "",
      amount: "",
      checked: 1,
      toAddressValidation: true,
      amountValidation: true
    };
  }

  componentDidMount() {
    this.props.getGasPriceFast();
    this.props.getGasPriceAverage()
    this.props.getGasPriceSlow();
  }

  getUsdGasPrice(gasPriceInEther) {
    try {
      const usdPrice = this.props.wallets[0].price;
      const ethBalance = parseFloat(gasPriceInEther);
      const usdBalance = usdPrice * ethBalance;
      const roundedUsdBalance = parseFloat(usdBalance).toFixed(6);
      return roundedUsdBalance;
    } catch (err) {
      console.error(err);
    }
  }

  async constructTransactionObject() {
    this.state.transactionNonce = await this.props.web3.eth.getTransactionCount(this.props.checksumAddress);
    const gasPriceInWei = parseFloat(this.props.web3.utils.toWei(this.state.gasPrice[this.state.checked].gasPriceInEther, 'Ether'));
    const amountInWei =  parseFloat(this.props.web3.utils.toWei(this.state.amount, 'Ether'));
    const transactionObject = {
      nonce: `0x${this.state.transactionNonce.toString(16)}`,
      to: this.state.toAddress,
      value: `0x${amountInWei.toString(16)}`,
      gasPrice: `0x${gasPriceInWei.toString(16)}`,
      gasLimit: `0x${parseFloat(21000).toString(16)}`,
      chainId: 3
    };
    return transactionObject;
  }

  validateToAddress(toAddress) {
    if (this.props.web3.utils.isAddress(toAddress)) {
      console.log('address validated!');
      this.setState({toAddressValidation: true});
      return true;
    } else {
      console.log('invalid address');
      this.setState({toAddressValidation: false});
      return false;
    }
  }

  renderInvalidToAddressMessage() {
    if(this.state.toAddressValidation){
      return ;
    } else {
      return <ErrorMessage>invalid address!</ErrorMessage>
    }
  }

  validateAmount(amount) {
    if (
      parseFloat(amount) + parseFloat(this.state.gasPrice[this.state.checked].gasPriceInEther) <
      parseFloat(this.props.balance) && 0 <= parseFloat(amount) && amount.length != 0
    ) {
      console.log('the amount validated!');
      this.setState({amountValidation: true})
      return true;
    } else {
      console.log('wrong balance!');
      this.setState({amountValidation: false})
      return false;
    }
  }

  renderInsufficientBalanceMessage() {
    if(this.state.amountValidation){
    } else {
      return <ErrorMessage>wrong balance!</ErrorMessage>
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
  }

  render() {
    this.state.gasPrice[0].gasPriceInEther = this.props.gasPrice.fast;
    this.state.gasPrice[1].gasPriceInEther = this.props.gasPrice.average;
    this.state.gasPrice[2].gasPriceInEther = this.props.gasPrice.slow;

    return (
      <RootContainer>
        <HeaderOne>Send</HeaderOne>
        <UntouchableCardContainer
          alignItems="flex-start"
          flexDirection="column"
          height="240px"
          justifyContent="flex-start"
          textAlign="left"
          width="95%"
         >
          <HeaderTwo
            fontSize="16px"
            marginBottom="4"
            marginTop="0"
          >
            To
          </HeaderTwo>
          <TextInput
            style={this.state.toAddressValidation ? styles.noError : styles.error}
            placeholder="address"
            clearButtonMode="while-editing"
            onChangeText={(toAddress) => {
              this.validateToAddress(toAddress);
              this.setState({toAddress});
            }}
          />
          <View>
            {this.renderInvalidToAddressMessage()}
          </View>
          <HeaderTwo
            fontSize="16px"
            marginBottom="4"
            marginTop="8"
          >
            Amount(ETH)
          </HeaderTwo>
          <TextInput
            style={this.state.amountValidation ? styles.noError : styles.error}
            placeholder="type the amount of ether you would like to send"
            clearButtonMode="while-editing"
            onChangeText={(amount) => {
              this.validateAmount(amount);
              this.setState({amount});
            }}
          />
          <View>
            {this.renderInsufficientBalanceMessage()}
          </View>
          <HeaderTwo
          fontSize="16px"
          marginBottom="4"
          marginTop="8"
          >
            Transaction Fee
          </HeaderTwo>
          <TransactionFeeContainer>
            {this.state.gasPrice.map((gasPrice, key) => (
              <View key={key}>
                {this.state.checked === key ? (
                  <TouchableOpacity>
                    <SelectedButton>{gasPrice.speed}</SelectedButton>
                    <Icon name={gasPrice.imageName} size={24} color="#39C89E" />
                    <SelectedButton>${this.getUsdGasPrice(gasPrice.gasPriceInEther)}</SelectedButton>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({ checked: key });
                    }}
                  >
                    <UnselectedButton>{gasPrice.speed}</UnselectedButton>
                    <Icon name={gasPrice.imageName} size={24} color="#000" />
                    <UnselectedButton>${this.getUsdGasPrice(gasPrice.gasPriceInEther)}</UnselectedButton>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </TransactionFeeContainer>
        </UntouchableCardContainer>
        <ButtonWrapper>
          <Button
            text="Next"
            textColor="white"
            backgroundColor="#4083FF"
            margin="24px auto"
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
    borderBottomColor: '#EEE'
  },
  error: {
    borderBottomWidth: 2,
    borderBottomColor: 'red'
  }
};


const TransactionFeeContainer = styled.View`
  alignItems: center;
  flexDirection: row;
  justifyContent: center;
`;

const SelectedButton = styled.Text`
  color: #39C89E
`;

const UnselectedButton = styled.Text`
  color: #000
`;

const ButtonWrapper = styled.View`
  alignItems: center;
`;

const ErrorMessage = styled.Text`
  color: red;
`;

function mapStateToProps(state) {
  return {
    checksumAddress: state.ReducerChecksumAddress.checksumAddress,
    gasPrice: state.ReducerGasPrice.gasPrice,
    web3: state.ReducerWeb3.web3,
    balance: state.ReducerBalance.balance,
    wallets: state.ReducerWallets.wallets
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
