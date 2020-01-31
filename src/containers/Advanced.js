'use strict';
import React, { Component } from 'react';
import { Clipboard, TouchableWithoutFeedback } from 'react-native';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import styled from 'styled-components/native';
import { RootContainer, HeaderOne, HeaderThree, CrypterestText } from '../components/common';
import FcmUpstreamMsgs from '../firebase/FcmUpstreamMsgs.ts';

class Advanced extends Component {
  constructor(props) {
    super();
    this.state = {
      clipboardContent: null
    };
    this.AnimationRef;
  }

  async writeToClipboard() {
    await Clipboard.setString(this.props.debugInfo.fcmToken);
    this.setState({ clipboardContent: this.props.debugInfo.fcmToken });
  }

  renderCopyText() {
    if (this.state.clipboardContent === this.props.debugInfo.fcmToken) {
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
    const otherDebugInfo = JSON.stringify(this.props.debugInfo.others);

    return (
      <RootContainer>
      <HeaderOne marginTop="96">Advanced</HeaderOne>
        <Container>
          <HeaderThree color="#000" marginBottom="0" marginLeft="0" marginTop="24">
            Your Fcm Token
          </HeaderThree>
          <CrypterestText fontSize="14">
            {this.props.debugInfo.fcmToken}
          </CrypterestText>
          {this.renderCopyText()}
          <HeaderThree color="#000" marginBottom="0" marginLeft="0" marginTop="24">
            Other Debug Info
          </HeaderThree>
          <CrypterestText fontSize="14">
            {otherDebugInfo}
          </CrypterestText>
          <HeaderThree color="#000" marginBottom="0" marginLeft="0" marginTop="24">
            Sync Your Transactions
          </HeaderThree>
          <Animatable.View ref={ref => (this.AnimationRef = ref)}>
            <Icon
              onPress={async () => {
                this.AnimationRef.rotate();
                await FcmUpstreamMsgs.resyncTransactions(this.props.checksumAddress);
              }}
              name="sync"
              color="#5f5f5f"
              size={28}
            />
          </Animatable.View>
        </Container>
      </RootContainer>
    );
  }
}

const Container = styled.View`
  align-items: flex-start;
  margin: 0 auto;
  flex-direction: column;
  justify-content: center;
  width: 90%;
`;
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

export default connect(mapStateToProps)(Advanced);
