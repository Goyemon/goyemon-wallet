'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Text } from 'react-native';
import { withNavigation } from 'react-navigation';
import styled from 'styled-components';
import { RootContainer, HeaderOne, TouchableCardContainer } from '../components/common';
import FcmUpstreamMessages from '../firebase/FcmUpstreamMessages.ts';

class EarnList extends Component {
  async componentDidMount() {
    await FcmUpstreamMessages.requestCDaiLendingInfo(this.props.checksumAddress);
  }

  render() {
    const { navigation } = this.props;

    return (
      <RootContainer>
        <HeaderOne marginTop="96">Earn</HeaderOne>
        <CardContainerWithoutFeedback>
          <UsdSuppliedBalanceText>Total Supplied</UsdSuppliedBalanceText>
          <UsdSuppliedBalance>$</UsdSuppliedBalance>
          <InterestEarnedText>earned!</InterestEarnedText>
        </CardContainerWithoutFeedback>
        <TouchableCardContainer
          alignItems="center"
          flexDirection="row"
          height="160px"
          justifyContent="center"
          textAlign="center"
          width="85%"
          onPress={ () => {
            navigation.navigate('EarnDai');
          }}
        >
          <CoinImageContainer>
            <CoinImage source={require('../../assets/dai_icon.png')} />
            <Text>Dai</Text>
          </CoinImageContainer>
          <TitleContainer>
            <TitleText>supplied</TitleText>
            <TitleText>rate</TitleText>
            <TitleText>interest earned</TitleText>
          </TitleContainer>
          <ValueContainer>
            <ValueText>424 DAI</ValueText>
            <ValueText>3.96%</ValueText>
            <ValueText>0.8313 DAI</ValueText>
          </ValueContainer>
        </TouchableCardContainer>
      </RootContainer>
    );
  }
}

const CardContainerWithoutFeedback = styled.View`
  align-items: center;
  background: #fff;
  borderRadius: 8px;
  height: 200px;
  margin: 8px auto;
  margin-top: 24px;
  padding: 24px;
  width: 85%
`;

const CoinImageContainer = styled.View`
  align-items: center;
  width: 12%;
`;

const CoinImage = styled.Image`
  border-radius: 20px;
  height: 40px;
  margin-bottom: 8px;
  width: 40px;
`;

const UsdSuppliedBalanceText = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  font-size: 20;
  margin-top: 24px;
  margin-bottom: 24px;
  text-transform: uppercase;
`;

const UsdSuppliedBalance = styled.Text`
  color: #000;
  font-family: 'HKGrotesk-Regular';
  font-size: 32;
`;

const InterestEarnedText = styled.Text`
  color: #000;
  font-family: 'HKGrotesk-Regular';
  font-size: 18;
  margin-top: 12px;
`;


const TitleContainer = styled.View`
  width: 44%;
`;

const TitleText = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  font-size: 18;
  font-weight: bold;
  margin-left: 16px;
  margin-bottom: 4px;
`;

const ValueContainer = styled.View`
  width: 44%;
`;

const ValueText = styled.Text`
  color: #000;
  font-family: 'HKGrotesk-Regular';
  font-size: 18;
  font-weight: bold;
  margin-left: 16px;
  margin-bottom: 4px;
`;

function mapStateToProps(state) {
  return {
    checksumAddress: state.ReducerChecksumAddress.checksumAddress
  };
}

export default withNavigation(connect(mapStateToProps)(EarnList));
