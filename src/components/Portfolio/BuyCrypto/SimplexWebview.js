"use strict";
import React, { Component } from "react";
import { BackHandler } from "react-native";
import { WebView } from "react-native-webview";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import styled from "styled-components/native";
import PortfolioStack from "../../../navigators/PortfolioStack";

export default class SimplexWebView extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerLeft: (
      <BackButtonContainer
        onPress={() => {
          navigation.navigate("BuyCrypto");
          PortfolioStack.navigationOptions = () => {
            const tabBarVisible = true;
            return {
              tabBarVisible
            };
          };
        }}
      >
        <Icon color="#00A3E2" name="chevron-left" size={40} />
      </BackButtonContainer>
    )
  });

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.handleBackButton);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton);
  }

  handleBackButton() {
    PortfolioStack.navigationOptions = () => {
      const tabBarVisible = true;
      return {
        tabBarVisible
      };
    };
  }

  render() {
    return (
      <WebView
        originWhitelist={["*"]}
        source={{
          html:
            "<head><meta name='viewport' content='initial-scale=1.0, maximum-scale=1.0'><style id='simplex-css'>.simplex-dd-container{width:95%;margin:16 auto;}.form-control{background-color:#FFF !important;border:none;}.crypto{margin:0;}.crypto_amount{font-size: 24 !important;margin-right:12;}.fiat{margin:16 auto;}.fiat_amount{font-size: 24 !important;margin-right:12;}.crypto-address{max-width:80%;margin:0 auto;}.flex-column{padding:0;}.simplex-continue-button{background-color:#FFF !important; color: #00A3E2 !important; border-color: #00A3E2 !important;font-size:20;}.powered-logo{width:90%;margin:16 auto;}</style></head><body><div id='simplex-form'></div><script src='https://iframe.sandbox.test-simplexcc.com/form.js'type='text/javascript'></script><script>window.simplex.createForm();</script></body>"
        }}
        containerStyle={{
          marginTop: 120
        }}
      />
    );
  }
}

const BackButtonContainer = styled.TouchableWithoutFeedback`
  align-items: center;
  flex-direction: row;
`;
