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
  GoyemonText
} from '../components/common';
import GlobalConfig from '../config.json';
import { FCMMsgs } from '../lib/fcm.js';
import LogUtilities from '../utilities/LogUtilities.js';

import axios from 'axios';


class Advanced extends Component {
  constructor(props) {
    super(props);
    this.state = {
	  clipboardContent: null,
	  canSendToHttp: true,
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

  async postLogToMagicalHttpEndpoint() {
	if (this.sendStateChangeTimer)
		return;

	const log = this.props.debugInfo.others instanceof Array ? this.props.debugInfo.others.join('\n') : JSON.stringify(this.props.debugInfo.others);
	const fcmtoken = this.props.debugInfo.fcmToken;
	try {
		await axios({
			method: 'post',
			url: 'http://51.89.42.181:31330/logData',
			data: {
			fcmToken: fcmtoken,
			logData: log,
			ctime: new Date().toString()
			}
		});

		if (this.sendStateChangeTimer)
			clearTimeout(this.sendStateChangeTimer);
		this.sendStateChangeTimer = setTimeout(() => {
			this.sendStateChangeTimer = null;
			this.setState({ canSendToHttp: true });
		}, 10000);
		this.setState({ canSendToHttp: false });
	}
	catch (e) {
		LogUtilities.logError(e, e.stack);
	}
  }

  componentWillUnmount() {
	  if (this.sendStateChangeTimer)
	  	clearTimeout(this.sendStateChangeTimer);
  }

  renderPostLog() {
	  if (this.state.canSendToHttp)
		return <TouchableWithoutFeedback onPress={async () => { this.postLogToMagicalHttpEndpoint(); }}>
	  				<CopyAddressText>Send log to magical http endpoint</CopyAddressText>
			   </TouchableWithoutFeedback>;
	  else
	  return <TouchableWithoutFeedback>
	  			<PostWaitText>(Please wait 10 seconds)</PostWaitText>
			</TouchableWithoutFeedback>;
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
            Network
          </HeaderThree>
          <GoyemonText fontSize="14">{GlobalConfig.network_name}</GoyemonText>
          <HeaderThree
            color="#000"
            marginBottom="0"
            marginLeft="0"
            marginTop="24"
          >
            Sync Your Wallet
          </HeaderThree>
          <Animatable.View ref={ref => (this.AnimationRef = ref)}>
            <Icon
              onPress={async () => {
                this.AnimationRef.rotate();
                FCMMsgs.resyncWallet(this.props.checksumAddress);
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
            Your Device Info
          </HeaderThree>
          <GoyemonText fontSize="14">
            {this.props.debugInfo.fcmToken}
          </GoyemonText>
          {this.renderCopyText()}
          <HeaderThree
            color="#000"
            marginBottom="0"
            marginLeft="0"
            marginTop="24"
          >
            Other Device Info
          </HeaderThree>
		  {this.renderPostLog()}
          <GoyemonText fontSize="14">{otherDebugInfo}</GoyemonText>
          <TouchableWithoutFeedback
            onPress={async () => {
              await Clipboard.setString(otherDebugInfo);
              this.setState({ clipboardContent: 'debug' });
            }}
          >
            <CopyAddressText>Copy</CopyAddressText>
          </TouchableWithoutFeedback>
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

const PostWaitText = styled.Text`
  color: #111111;
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
