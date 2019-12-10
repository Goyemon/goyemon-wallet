'use strict';
import React, { Component } from 'react';
import styled from 'styled-components';
import { store } from '../store/store.js';

export default class PriceUtilities extends Component {
  convertEthToUsd(ether) {
    const stateTree = store.getState();
    const ethPrice = stateTree.ReducerPrice.price.ethPrice;

    try {
      const usdValue = parseFloat(ethPrice) * parseFloat(ether);
      const roundedEthUsdValue = usdValue.toFixed(3);
      return roundedEthUsdValue;
    } catch (err) {
      console.error(err);
    }
  }

  convertDaiToUsd(dai) {
    const stateTree = store.getState();
    const daiPrice = stateTree.ReducerPrice.price.daiPrice;

    try {
      const usdValue = daiPrice * parseFloat(dai);
      const roundedDaiUsdValue = parseFloat(usdValue).toFixed(2);
      return roundedDaiUsdValue;
    } catch (err) {
      console.error(err);
    }
  }

  toggleCurrencySymbol(currency) {
    if (currency === 'ETH') {
      return <CurrencySymbol>ETH</CurrencySymbol>;
    } else if (currency === 'USD') {
      return <CurrencySymbol>$</CurrencySymbol>;
    }
  }
}

const CurrencySymbol = styled.Text`
  font-family: 'HKGrotesk-Regular';
  font-size: 20px;
`;
