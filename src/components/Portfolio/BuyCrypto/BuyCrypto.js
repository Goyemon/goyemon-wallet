"use strict";
import React, { Component } from "react";
import { Linking } from "react-native";
import styled from "styled-components";
import {
  RootContainer,
  TouchableCardContainer,
  HeaderOne,
  Description
} from "../../common";
import PortfolioStack from "../../../navigators/PortfolioStack";

export default class BuyCrypto extends Component {
  render() {
    return (
      <RootContainer>
        <HeaderOne marginTop="112">Buy Crypto</HeaderOne>
        <TouchableCardContainer
          alignItems="center"
          flexDirection="column"
          height="120px"
          justifyContent="space-between"
          textAlign="left"
          width="90%"
          onPress={() => {
            PortfolioStack.navigationOptions = () => {
              const tabBarVisible = false;
              return {
                tabBarVisible
              };
            };
            this.props.navigation.navigate("SimplexWebView");
          }}
        >
          <IconImageContainer></IconImageContainer>
          <NameContainer>
            <Description>Simplex</Description>
          </NameContainer>
        </TouchableCardContainer>
        <TouchableCardContainer
          alignItems="center"
          flexDirection="column"
          height="120px"
          justifyContent="space-between"
          textAlign="left"
          width="90%"
          onPress={() => {
            Linking.openURL(
              "https://buy-staging.moonpay.io?apiKey=pk_test_5rrKC6JCcKWROpZmcPtuoYaFoUnw2fLs&colorCode=%2300A3E2"
            );
          }}
        >
          <IconImageContainer></IconImageContainer>
          <NameContainer>
            <Description>MoonPay</Description>
          </NameContainer>
        </TouchableCardContainer>
      </RootContainer>
    );
  }
}

const IconImageContainer = styled.View`
  align-items: center;
`;

const NameContainer = styled.View`
  margin-left: 16;
`;
