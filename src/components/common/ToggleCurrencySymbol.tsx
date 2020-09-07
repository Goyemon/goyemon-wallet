"use strict";
import React from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import styled from "styled-components/native";
import { GoyemonText } from "./Texts";

interface ToggleCurrencySymbolProps {
  currency: string;
}

export const ToggleCurrencySymbol = (props: ToggleCurrencySymbolProps) => {
  if (props.currency === "ETH") {
    return (
      <CurrencySymbol>
        <GoyemonText fontSize={16}>ETH</GoyemonText>
        <Icon name="swap-horizontal" size={16} color="#5f5f5f" />
        <CurrencySymbolTextChosen>USD</CurrencySymbolTextChosen>
      </CurrencySymbol>
    );
  } else if (props.currency === "USD") {
    return (
      <CurrencySymbol>
        <CurrencySymbolTextChosen>ETH</CurrencySymbolTextChosen>
        <Icon name="swap-horizontal" size={16} color="#5f5f5f" />
        <GoyemonText fontSize={16}>USD</GoyemonText>
      </CurrencySymbol>
    );
  } else return null;
};

const CurrencySymbol = styled.Text`
  font-family: "HKGrotesk-Regular";
  font-size: 16;
`;

const CurrencySymbolTextChosen = styled.Text`
  font-family: "HKGrotesk-Regular";
  color: #1ba548;
`;
