'use strict';
import Animation from 'lottie-react-native';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
import styled from 'styled-components/native';
import Web3 from 'web3';
import { getGasPriceAverage } from '../actions/ActionGasPrice';
import { RootContainer, Button } from '../components/common';
import cDaiContract from '../contracts/cDaiContract';
import daiTokenContract from '../contracts/daiTokenContract';
import GasUtilities from '../utilities/GasUtilities.js';
import TransactionUtilities from '../utilities/TransactionUtilities.ts';
import Web3ProviderUtilities from '../utilities/Web3ProviderUtilities.js';

class ApproveDai extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ethAmountValidation: undefined
    };
    this.web3 = Web3ProviderUtilities.web3Provider();
    this.ethBalance = Web3.utils.fromWei(props.balance.weiBalance.toString());
  }

  componentDidMount() {
    this.props.getGasPriceAverage();
  }

  validateEthAmount() {
    const transactionFeeLimitInEther = GasUtilities.getTransactionFeeEstimateInEther(
      this.props.gasPrice.average,
      50000
    );

    if (parseFloat(this.ethBalance) > parseFloat(transactionFeeLimitInEther)) {
      console.log('the eth amount validated!');
      this.setState({ ethAmountValidation: true });
      return true;
    }
    console.log('wrong eth balance!');
    this.setState({ ethAmountValidation: false });
    return false;
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
      return <ErrorMessage>you need to have some ether to initiate</ErrorMessage>;
    }
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
      gasPrice: `0x${this.props.gasPrice.average.toString(16)}`,
      gasLimit: `0x${parseFloat(50000).toString(16)}`,
      chainId: 3,
      data: approveEncodedABI
    };
    return transactionObject;
  }

  sendTransaction = async () => {
    const ethAmountValidation = this.validateEthAmount();

    if (ethAmountValidation) {
      console.log('validation successful');
      const transactionObject = await this.constructTransactionObject();
      await TransactionUtilities.sendOutgoingTransactionToServer(transactionObject);
      this.props.navigation.navigate('EarnDai');
    } else {
      console.log('validation failed!');
    }
  };

  render() {
    return (
      <RootContainer>
        <Container>
          <Button
            text="Initiate"
            textColor="#00A3E2"
            backgroundColor="#FFF"
            borderColor="#00A3E2"
            margin="400px auto 40px"
            opacity="1"
            onPress={async () => {
              await this.sendTransaction();
            }}
          />
          <View>{this.renderInsufficientEthBalanceMessage()}</View>
        </Container>
      </RootContainer>
    );
  }
}

const Container = styled.View`
  align-items: center;
  flex-direction: column;
  justify-content: center;
`;

const ErrorMessage = styled.Text`
  color: #e41b13;
  font-family: 'HKGrotesk-Regular';
`;

function mapStateToProps(state) {
  return {
    gasPrice: state.ReducerGasPrice.gasPrice,
    balance: state.ReducerBalance.balance
  };
}

const mapDispatchToProps = {
  getGasPriceAverage
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ApproveDai);
