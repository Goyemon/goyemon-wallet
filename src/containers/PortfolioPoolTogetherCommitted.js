'use strict';
import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styled from 'styled-components';
import { withNavigation } from 'react-navigation';
import { RootContainer, HeaderFive, GoyemonText } from '../components/common';
import { RoundDownBigNumberPlacesFour } from '../utilities/BigNumberUtilities';

class PortfolioPoolTogetherCommitted extends Component {
  renderChanceOfWinning() {
    const pooltogetherDaiCommittedBalance = RoundDownBigNumberPlacesFour(
      this.props.balance.pooltogetherDai.committed
    ).div(new RoundDownBigNumberPlacesFour(10).pow(18));

    const ticketsSold = RoundDownBigNumberPlacesFour(
      this.props.poolTogether.dai.committedSupply
    ).div(new RoundDownBigNumberPlacesFour(10).pow(18));

    const chanceOfWinning = ticketsSold
      .div(pooltogetherDaiCommittedBalance)
      .toFixed(0);

    if (pooltogetherDaiCommittedBalance.isGreaterThan(0)) {
      return (
        <RoundInfo>
          <IconContainer>
            <Icon name="circle-slice-1" size={32} color="#5f5f5f" />
          </IconContainer>
          <View>
            <HeaderFive width="100%">chance of winning</HeaderFive>
            <GoyemonText fontSize={14}>1 / {chanceOfWinning} </GoyemonText>
          </View>
        </RoundInfo>
      );
    } else if (pooltogetherDaiCommittedBalance.isLessThanOrEqualTo(0)) {
      return null;
    }
  }

  render() {
    const pooltogetherDaiCommittedBalance = RoundDownBigNumberPlacesFour(
      this.props.balance.pooltogetherDai.committed
    ).div(new RoundDownBigNumberPlacesFour(10).pow(18));

    const poolBalance = RoundDownBigNumberPlacesFour(
      this.props.poolTogether.dai.totalBalance
    )
      .minus(this.props.poolTogether.dai.openSupply)
      .div(new RoundDownBigNumberPlacesFour(10).pow(18))
      .toFixed(2);

    const estimatedPrize = RoundDownBigNumberPlacesFour(
      this.props.poolTogether.dai.estimatedInterestRate
    )
      .times(
        RoundDownBigNumberPlacesFour(this.props.poolTogether.dai.totalBalance).minus(
          this.props.poolTogether.dai.openSupply
        )
      )
      .div(new RoundDownBigNumberPlacesFour(10).pow(36))
      .toFixed(2);

    return (
      <RootContainer>
        <PoolTogetherContainer>
          <RoundInfoContainer>
            <RoundInfo>
              <IconContainer>
                <Icon name="opacity" size={32} color="#5f5f5f" />
              </IconContainer>
              <View>
                <HeaderFive width="100%">pool balance</HeaderFive>
                <GoyemonText fontSize={14}>{poolBalance} DAI</GoyemonText>
              </View>
            </RoundInfo>
            <RoundInfo>
              <IconContainer>
                <Icon name="trophy-outline" size={32} color="#5f5f5f" />
              </IconContainer>
              <View>
                <HeaderFive width="100%">prize estimated</HeaderFive>
                <GoyemonText fontSize={14}>{estimatedPrize} DAI</GoyemonText>
              </View>
            </RoundInfo>
            {this.renderChanceOfWinning()}
            <RoundInfo>
              <IconContainer>
                <CoinImage source={require('../../assets/dai_icon.png')} />
              </IconContainer>
              <View>
                <HeaderFive width="100%">your balance</HeaderFive>
                <GoyemonText fontSize={14}>
                  {pooltogetherDaiCommittedBalance.toFixed(0)} DAI
                </GoyemonText>
              </View>
            </RoundInfo>
          </RoundInfoContainer>
        </PoolTogetherContainer>
      </RootContainer>
    );
  }
}

const PoolTogetherContainer = styled.View`
  background: #fff;
  margin: 16px auto;
  padding: 16px 32px;
  border-radius: 8;
`;

const RoundInfoContainer = styled.View`
  align-items: flex-start;
  background-color: #fff;
  border-radius: 8px;
  flex-direction: column;
  justify-content: center;
`;

const RoundInfo = styled.View`
  align-items: flex-start;
  background-color: #fff;
  border-radius: 8px;
  flex-direction: row;
  margin-bottom: 12;
  justify-content: flex-start;
`;

const IconContainer = styled.View`
  margin-right: 8;
`;

const CoinImage = styled.Image`
  border-radius: 20px;
  height: 32px;
  width: 32px;
`;

const mapStateToProps = (state) => ({
  balance: state.ReducerBalance.balance,
  poolTogether: state.ReducerPoolTogether.poolTogether
});

export default withNavigation(
  connect(mapStateToProps)(PortfolioPoolTogetherCommitted)
);
