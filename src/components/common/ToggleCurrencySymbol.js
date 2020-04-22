'use strict';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styled from 'styled-components';
import { GoyemonText } from '../common';

const ToggleCurrencySymbol = (props) => {
  if (props.currency === 'ETH') {
    return (
      <CurrencySymbol>
        <GoyemonText fontSize={14}>ETH</GoyemonText>
        <Icon name="swap-horizontal" size={16} color="#5f5f5f" />
        <CurrencySymbolTextChosen>USD</CurrencySymbolTextChosen>
      </CurrencySymbol>
    );
  } else if (props.currency === 'USD') {
    return (
      <CurrencySymbol>
        <CurrencySymbolTextChosen>ETH</CurrencySymbolTextChosen>
        <Icon name="swap-horizontal" size={16} color="#5f5f5f" />
        <GoyemonText fontSize={14}>USD</GoyemonText>
      </CurrencySymbol>
    );
  }
};

const CurrencySymbol = styled.Text`
  font-family: 'HKGrotesk-Regular';
  font-size: 16;
`;

const CurrencySymbolTextChosen = styled.Text`
  color: #1ba548;
`;

export { ToggleCurrencySymbol };
