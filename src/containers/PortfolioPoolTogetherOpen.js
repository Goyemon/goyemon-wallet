'use strict';
import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styled from 'styled-components';
import { withNavigation } from 'react-navigation';
import {
  RootContainer,
  HeaderFive,
  GoyemonText,
  Button
} from '../components/common';
import I18n from '../i18n/I18n';
import { RoundDownBigNumber } from '../utilities/BigNumberUtilities';

class PortfolioPoolTogetherOpen extends Component {
  render() {
    const pooltogetherDaiOpenBalance = RoundDownBigNumber(
      this.props.balance.pooltogetherDai.open
    )
      .div(new RoundDownBigNumber(10).pow(18))
      .toFixed(0);

    return (
      <RootContainer>
        <PoolTogetherContainer>
          <RoundInfoContainer>
            <IconContainer>
              <CoinImage source={require('../../assets/dai_icon.png')} />
            </IconContainer>
            <View>
              <HeaderFive width="100%">your balance</HeaderFive>
              <GoyemonText fontSize={14}>
                {pooltogetherDaiOpenBalance} DAI
              </GoyemonText>
            </View>
          </RoundInfoContainer>
        </PoolTogetherContainer>
        <ButtonContainer>
          <Button
            text={I18n.t('deposit')}
            textColor="#00A3E2"
            backgroundColor="#FFF"
            borderColor="#00A3E2"
            margin="8px auto"
            marginBottom="12px"
            opacity="1"
            onPress={async () => {
              this.props.navigation.navigate('DepositDaiToPoolTogether');
            }}
          />
        </ButtonContainer>
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
  align-items: center;
  background-color: #fff;
  border-radius: 8px;
  flex-direction: row;
  justify-content: center;
`;

const IconContainer = styled.View`
  margin-right: 8;
`;

const CoinImage = styled.Image`
  border-radius: 20px;
  height: 32px;
  width: 32px;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-top: 16;
`;

const mapStateToProps = (state) => ({
  balance: state.ReducerBalance.balance
});

export default withNavigation(
  connect(mapStateToProps)(PortfolioPoolTogetherOpen)
);
