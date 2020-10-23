"use strict";
import React, { Component } from "react";
import { BackHandler } from "react-native";
import { WebView } from "react-native-webview";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import styled from "styled-components/native";
import GlobalConfig from "../../../config.json";
import PortfolioStack from "../../../navigators/PortfolioStack";

export default class SimplexWebview extends Component {
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

  renderWebView() {
    if (GlobalConfig.network_name === "ropsten") {
      return (
        <WebView
          originWhitelist={["*"]}
          source={{
            uri: GlobalConfig.simplex_ropsten_link
          }}
          javaScriptEnabled
          injectedJavaScript={"window.simplex.createForm();"}
          onMessage={(event) => {
            console.log("event: ", event);
          }}
          containerStyle={{
            marginTop: 120
          }}
        />
      );
    } else if (GlobalConfig.network_name === "mainnet") {
      return (
        <WebView
          originWhitelist={["*"]}
          source={{
            uri: GlobalConfig.simplex_mainnet_link
          }}
          javaScriptEnabled
          injectedJavaScript={"window.simplex.createForm();"}
          onMessage={(event) => {
            console.log("event: ", event);
          }}
          containerStyle={{
            marginTop: 120
          }}
        />
      );
    } else {
      console.log("no network matches");
    }
  }

  render() {
    return <>{this.renderWebView()}</>;
  }
}

const BackButtonContainer = styled.TouchableWithoutFeedback`
  align-items: center;
  flex-direction: row;
`;
