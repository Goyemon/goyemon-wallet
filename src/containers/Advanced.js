'use strict';
import React, { Component } from 'react';
import { Clipboard, TouchableWithoutFeedback } from 'react-native';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import styled from 'styled-components/native';
import { saveFcmToken } from '../actions/ActionDebugInfo';
import {
  RootContainer,
  Container,
  HeaderOne,
  HeaderThree,
  CrypterestText
} from '../components/common';
import GlobalConfig from '../config.json';
import { FCMMsgs } from '../lib/fcm.js';
import LogUtilities from '../utilities/LogUtilities.js';
 
class Advanced extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clipboardContent: null
    };
    this.AnimationRef;
  }

  componentDidMount() {
    this.getFcmToken();
  }

  getFcmToken() {
    FCMMsgs.getFcmToken().then(fcmToken => {
      if (fcmToken) {
        LogUtilities.logInfo('the current fcmToken ===>', fcmToken);
        this.props.saveFcmToken(fcmToken);
      } else {
        LogUtilities.logInfo('no fcmToken ');
      }
    });
  }

  async writeToClipboard() {
    await Clipboard.setString(this.props.debugInfo.fcmToken);
    this.setState({ clipboardContent: 'token' });
  }

  renderCopyText() {
    if (this.state.clipboardContent === 'token') {
      return (
        <CopiedAddressContainer>
          <TouchableWithoutFeedback
            onPress={async () => {
              await this.writeToClipboard();
            }}
          >
            <CopiedAddressText>Copied</CopiedAddressText>
          </TouchableWithoutFeedback>
          <Icon name="check" size={24} color="#00A3E2" />
        </CopiedAddressContainer>
      );
    } else if (this.state.clipboardContent === null) {
      return (
        <TouchableWithoutFeedback
          onPress={async () => {
            await this.writeToClipboard();
          }}
        >
          <CopyAddressText>Copy</CopyAddressText>
        </TouchableWithoutFeedback>
      );
    }
  }

  render() {
    // const otherDebugInfo = JSON.stringify(this.props.debugInfo.others);
    const otherDebugInfo =
      this.props.debugInfo.others instanceof Array
        ? this.props.debugInfo.others.join('\n')
        : JSON.stringify(this.props.debugInfo.others);

    return (
      <RootContainer>
        <HeaderOne marginTop="96">Advanced</HeaderOne>
        <Container
          alignItems="flex-start"
          flexDirection="column"
          justifyContent="center"
          marginTop={0}
          width="90%"
        >
          <HeaderThree
            color="#000"
            marginBottom="0"
            marginLeft="0"
            marginTop="24"
          >
            Your Device Info
          </HeaderThree>
          <CrypterestText fontSize="14">
            {this.props.debugInfo.fcmToken}
          </CrypterestText>
          {this.renderCopyText()}
          <HeaderThree
            color="#000"
            marginBottom="0"
            marginLeft="0"
            marginTop="24"
          >
            Other Device Info
          </HeaderThree>
          <CrypterestText fontSize="14">{otherDebugInfo}</CrypterestText>
          <TouchableWithoutFeedback
            onPress={async () => {
              await Clipboard.setString(otherDebugInfo);
              this.setState({ clipboardContent: 'debug' });
            }}
          >
            <CopyAddressText>Copy</CopyAddressText>
          </TouchableWithoutFeedback>
          <HeaderThree
            color="#000"
            marginBottom="0"
            marginLeft="0"
            marginTop="24"
          >
            Sync Your Transactions
          </HeaderThree>
          <Animatable.View ref={ref => (this.AnimationRef = ref)}>
            <Icon
              onPress={async () => {
                this.AnimationRef.rotate();
                FCMMsgs.resyncTransactions(this.props.checksumAddress);
              }}
              name="sync"
              color="#5f5f5f"
              size={28}
            />
          </Animatable.View>
          <HeaderThree
            color="#000"
            marginBottom="0"
            marginLeft="0"
            marginTop="24"
          >
            Network
          </HeaderThree>
          <CrypterestText fontSize="14">{GlobalConfig.network_name}</CrypterestText>
        </Container>
      </RootContainer>
    );
  }
}

const CopiedAddressContainer = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: center;
`;

const CopiedAddressText = styled.Text`
  color: #00a3e2;
  font-family: 'HKGrotesk-Regular';
  font-size: 16;
  margin-right: 4;
`;

const CopyAddressText = styled.Text`
  color: #00a3e2;
  font-family: 'HKGrotesk-Regular';
  font-size: 16;
`;

function mapStateToProps(state) {
  return {
    checksumAddress: state.ReducerChecksumAddress.checksumAddress,
    debugInfo: state.ReducerDebugInfo.debugInfo
  };
}

const mapDispatchToProps = {
  saveFcmToken
};

export default connect(mapStateToProps, mapDispatchToProps)(Advanced);
