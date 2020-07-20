'use strict';
import React from 'react';
import styled from 'styled-components';
import { UntouchableCardContainer, GoyemonText } from '../common';

const TokenBalanceCards = (props) => (
  <>
    {props.cards.map((card) => (
      <TokenBalanceCard
        price={card.price}
        balance={card.balance}
        usd={card.usd}
        iconPath={card.icon}
        token={card.token}
        key={card.token}
      />
    ))}
  </>
);

const TokenBalanceCard = (props) => (
  <UntouchableCardContainer
    alignItems="center"
    borderRadius="8"
    flexDirection="row"
    height="120px"
    justifyContent="space-between"
    marginTop={8}
    textAlign="left"
    width="90%"
  >
    <CoinImageContainer>
      <CoinImage source={props.iconPath} />
      <CoinText>{props.token}</CoinText>
    </CoinImageContainer>
    <PriceContainer>
      <PriceText>1 {props.token}</PriceText>
      <PriceText>= ${props.price}</PriceText>
    </PriceContainer>
    <BalanceContainer>
      <UsdBalanceText>${props.usd}</UsdBalanceText>
      <BalanceText>
        <GoyemonText fontSize="20">
          {props.balance} {props.token}
        </GoyemonText>
      </BalanceText>
    </BalanceContainer>
  </UntouchableCardContainer>
);

const CoinImageContainer = styled.View`
  align-items: center;
  width: 20%;
`;

const CoinImage = styled.Image`
  border-radius: 20px;
  height: 40px;
  width: 40px;
`;

const CoinText = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  font-size: 16;
  margin-top: 4;
  margin-bottom: 4;
`;

const PriceContainer = styled.View`
  margin-left: 16;
  width: 35%;
`;

const PriceText = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  font-size: 16;
  margin-top: 4;
  margin-bottom: 4;
`;

const BalanceContainer = styled.View`
  width: 45%;
`;

const UsdBalanceText = styled.Text`
  color: #000;
  font-family: 'HKGrotesk-Regular';
  font-size: 22;
  margin-bottom: 4;
`;

const BalanceText = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  font-size: 20;
`;

export default TokenBalanceCards;
