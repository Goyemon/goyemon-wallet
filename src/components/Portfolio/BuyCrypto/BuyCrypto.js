"use strict";
import React, { Component } from "react";
import { Linking } from "react-native";
import styled from "styled-components";
import {
  RootContainer,
  Container,
  TouchableCardContainer,
  HeaderOne,
  Description
} from "../../common";
import PortfolioStack from "../../../navigators/PortfolioStack";
import GlobalConfig from "../../../config.json";

export default class BuyCrypto extends Component {
  render() {
    return (
      <RootContainer>
        <HeaderOne marginTop="112">Buy Crypto</HeaderOne>
        <Container
          alignItems="flex-start"
          flexDirection="column"
          justifyContent="center"
          marginTop={16}
          width="100%"
        >
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
              if (GlobalConfig.network_name === "ropsten") {
                Linking.openURL(GlobalConfig.moonpay_ropsten_link);
              } else if (GlobalConfig.network_name === "mainnet") {
                Linking.openURL(GlobalConfig.moonpay_mainnet_link);
              } else {
                console.log("no network matches");
              }
            }}
          >
            <LogoContainer>
              <Logo source={require("../../../../assets/moonpay_logo.png")} />
            </LogoContainer>
            <Description>MoonPay</Description>
          </TouchableCardContainer>
        </Container>
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
