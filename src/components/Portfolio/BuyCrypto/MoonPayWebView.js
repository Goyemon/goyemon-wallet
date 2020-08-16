'use strict';
import React, { Component } from 'react';
import { WebView } from 'react-native-webview';

export default class MoonPayWebView extends Component {
  render() {
    return (
      <WebView
        originWhitelist={['*']}
        source={{
          html:
            '<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><meta http-equiv="X-UA-Compatible" content="ie=edge" /><title>MoonPay Widget</title><style type="text/css">html{margin:0;height:100%;overflow:hidden}iframe{position:absolute;left:0;right:0;bottom:0;top:0;border:0}</style></head><body> <iframe allow="accelerometer; autoplay; camera; gyroscope; payment" frameborder="0" height="100%" src="https://buy-staging.moonpay.io?apiKey=pk_test_5rrKC6JCcKWROpZmcPtuoYaFoUnw2fLs" width="100%" ><p>Your browser does not support iframes.</p> </iframe></body>'
        }}
        containerStyle={{
          marginTop: 120
        }}
      />
    );
  }
}
