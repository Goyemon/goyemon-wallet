'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Clipboard, TouchableWithoutFeedback, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styled from 'styled-components/native';
import I18n from '../i18n/I18n';

class Copy extends Component {
  constructor(props) {
    super();
    this.state = {
      clipboardContent: null
    };
  }

  async writeToClipboard(clipboardContent) {
    await Clipboard.setString(clipboardContent);
    this.setState({ clipboardContent });
  }

  renderCopyText(text) {
    if (this.state.clipboardContent === text) {
      return (
        <CopiedAddressContainer>
          <TouchableWithoutFeedback
            onPress={async () => {
              await this.writeToClipboard(text);
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
            await this.writeToClipboard(text);
          }}
        >
          <CopyAddressText>{I18n.t('copy')}</CopyAddressText>
        </TouchableWithoutFeedback>
      );
    }
  }

  render() {
    return <View>{this.renderCopyText(this.props.text)}</View>;
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
    checksumAddress: state.ReducerChecksumAddress.checksumAddress
  };
}

export default connect(mapStateToProps)(Copy);
