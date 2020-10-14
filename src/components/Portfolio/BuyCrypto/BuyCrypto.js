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
          flexDirection="row"
          height="120px"
          justifyContent="center"
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
          <LogoContainer>
            <Logo source={require("../../../../assets/simplex_logo.jpeg")} />
          </LogoContainer>
          <Description>Simplex</Description>
        </TouchableCardContainer>
        <TouchableCardContainer
          alignItems="center"
          flexDirection="row"
          height="120px"
          justifyContent="center "
          textAlign="left"
          width="90%"
          onPress={() => {
            Linking.openURL(
              "https://buy-staging.moonpay.io?apiKey=pk_test_5rrKC6JCcKWROpZmcPtuoYaFoUnw2fLs&colorCode=%2300A3E2"
            );
          }}
        >
          <LogoContainer>
            <Logo source={require("../../../../assets/moonpay_logo.png")} />
          </LogoContainer>
          <Description>MoonPay</Description>
        </TouchableCardContainer>
      </RootContainer>
    );
  }
}

const LogoContainer = styled.View`
  margin-right: 4;
`;

const Logo = styled.Image`
  border-radius: 20px;
  height: 40px;
  width: 40px;
`;
