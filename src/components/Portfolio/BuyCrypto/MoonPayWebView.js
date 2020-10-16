"use strict";
import React, { Component } from "react";
import { WebView } from "react-native-webview";
import GlobalConfig from "../../../config.json";

export default class MoonPayWebView extends Component {
  renderWebView() {
    if (GlobalConfig.network_name === "ropsten") {
      return (
        <WebView
          originWhitelist={["*"]}
          source={{
            html: GlobalConfig.moonpay_ropsten_html
          }}
        />
      );
    } else if (GlobalConfig.network_name === "mainnet") {
      return (
        <WebView
          originWhitelist={["*"]}
          source={{
            html: GlobalConfig.moonpay_mainnet_html
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
