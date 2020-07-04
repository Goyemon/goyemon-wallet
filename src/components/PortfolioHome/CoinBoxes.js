'use strict';
import React from 'react';
import { GoyemonText } from '../common';
import styled from 'styled-components';

const CoinBoxes = props =>
  <>
    {props.boxes.map(coin => <CoinBox
      source={coin.path}
      token={coin.token}
      usd={coin.usd}
      balance={coin.balance}
    />)}
  </>

const CoinBox = props =>
  <CurrencyContainer>
    <CurrencyImageContainer>
      <CoinImage source={props.source} />
      <CoinText>{props.token}</CoinText>
    </CurrencyImageContainer>
    <CurrencyBalanceContainer>
      <UsdBalanceContainer>
        <UsdBalanceText>
          ${props.usd}
        </UsdBalanceText>
      </UsdBalanceContainer>
      <TokenBalanceContainer style={{marginLeft: props.token === 'plDAI'?4:16}}>
        <BalanceText>
          {props.token === 'plDAI'
          ? <><GoyemonText fontSize="16">{props.balance[0]}</GoyemonText>
              <GoyemonText fontSize="16"> | {props.balance[1]} | </GoyemonText>
              <GoyemonText fontSize="16">{props.balance[2]}</GoyemonText>
            </>
          : <GoyemonText fontSize="16">{props.balance}</GoyemonText>
          }
        </BalanceText>
      </TokenBalanceContainer>
    </CurrencyBalanceContainer>
  </CurrencyContainer>

const CurrencyContainer = styled.View`
align-items: center;
background-color: #fff;
border-radius: 8px;
flex-direction: row;
justify-content: center;
margin-right: 16;
padding: 16px 8px;
width: 22%;
`;

const CurrencyBalanceContainer = styled.View`
flex-direction: column;
`;

const CurrencyImageContainer = styled.View`
align-items: center;
`;

const CoinImage = styled.Image`
border-radius: 20px;
height: 32px;
width: 32px;
margin-bottom: 4;
`;

const CoinText = styled.Text`
color: #5f5f5f;
font-family: 'HKGrotesk-Regular';
font-size: 12;
`;

const UsdBalanceContainer = styled.View`
margin-left: 16;
`;

const TokenBalanceContainer = styled.View`
`;

const UsdBalanceText = styled.Text`
color: #000;
font-family: 'HKGrotesk-Regular';
font-size: 18;
margin-bottom: 4;
`;

const BalanceText = styled.Text`
color: #5f5f5f;
font-family: 'HKGrotesk-Regular';
`;

export default CoinBoxes
