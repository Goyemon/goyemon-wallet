'use strict';
import BigNumber from "bignumber.js"
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Text } from 'react-native';
import { withNavigation } from 'react-navigation';
import styled from 'styled-components';
import {
  RootContainer,
  UntouchableCardContainer,
  TransactionButton,
  HeaderOne,
  HeaderFour,
  Button
} from '../components/common/';
import { saveDaiApprovalInfo } from '../actions/ActionCDaiLendingInfo';
import TransactionUtilities from '../utilities/TransactionUtilities.ts';

class EarnDai extends Component {
  async componentDidMount() {
    this.props.saveDaiApprovalInfo(TransactionUtilities.daiApproved());
  }

  renderTransactionButtons() {
    if (this.props.cDaiLendingInfo.daiApproval) {
      return (
        <ButtonContainer>
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
        </ButtonContainer>
      );
    }
      console.log('dai not approved yet');
  }

  renderApproveButton() {
    if(!this.props.cDaiLendingInfo.daiApproval) {
      return (
        <Button
          text="Approve"
          textColor="#00A3E2"
          backgroundColor="#FFF"
          borderColor="#00A3E2"
          margin="40px auto"
          opacity="1"
          onPress={async () => {
            this.props.navigation.navigate('ApproveDai');
          }}
        />
      );
    }
      console.log('dai already approved');
  }

  render() {
    const { balance, cDaiLendingInfo } = this.props;
    let lifetimeEarnedInDai = new BigNumber(cDaiLendingInfo.lifetimeEarned).div(10 ** 36);
    lifetimeEarnedInDai = lifetimeEarnedInDai.toFixed(4);
    const daiSavingsBalance = new BigNumber(balance.daiSavingsBalance).div(10 ** 36).toFixed(4);

    return (
      <RootContainer>
        <HeaderOne marginTop="96">Dai</HeaderOne>
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
          <HeaderFour marginTop="24">dai savings balance</HeaderFour>
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

const ButtonContainer = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  margin: 0 auto;
  width: 90%;
`;

function mapStateToProps(state) {
  return {
    balance: state.ReducerBalance.balance,
    cDaiLendingInfo: state.ReducerCDaiLendingInfo.cDaiLendingInfo
  };
}

const mapDispatchToProps = {
  saveDaiApprovalInfo
};

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(EarnDai));
