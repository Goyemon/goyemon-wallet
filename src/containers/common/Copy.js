'use strict';
import React, { Component } from 'react';
import * as Animatable from 'react-native-animatable';
import { connect } from 'react-redux';
import { Clipboard, TouchableWithoutFeedback, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styled from 'styled-components/native';
import I18n from '../../i18n/I18n';

class Copy extends Component {
  constructor(props) {
    super();
    this.state = {
      clipboardContent: null
    };
  }

  fadeOutUp = () =>
    this.view
      .fadeOutUp(800)
      .then((endState) =>
        console.log(
          endState.finished ? 'fadeOutUp finished' : 'fadeOutUp cancelled'
        )
      );

  async writeToClipboard(clipboardContent) {
    await Clipboard.setString(clipboardContent);
    this.setState({ clipboardContent });
  }

  renderAnimation() {
    const handleViewRef = (ref) => (this.view = ref);
    if (this.props.animation) {
      return <CopyAnimation ref={handleViewRef}>❤️</CopyAnimation>;
    } else {
      return <CopyAnimation ref={handleViewRef}></CopyAnimation>;
    }
  }

  renderCopyText(text) {
    if (this.state.clipboardContent === text) {
      return (
        <CopiedAddressContainer>
          <TouchableWithoutFeedback
            onPress={async () => {
              await this.writeToClipboard(text);
              this.fadeOutUp();
            }}
          >
            <CopyAddress>
              <Icon name="content-copy" size={18} color="#00a3e2" />
              <CopyAddressText>Copied</CopyAddressText>
              {this.renderAnimation()}
            </CopyAddress>
          </TouchableWithoutFeedback>
        </CopiedAddressContainer>
      );
    } else if (this.state.clipboardContent === null) {
      return (
        <TouchableWithoutFeedback
          onPress={async () => {
            await this.writeToClipboard(text);
            this.fadeOutUp();
          }}
        >
          <CopyAddress>
            <Icon name="content-copy" size={18} color="#00a3e2" />
            <CopyAddressText>{I18n.t('copy')}</CopyAddressText>
          </CopyAddress>
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

const CopyAnimation = Animatable.createAnimatableComponent(styled.Text``);

const CopyAddress = styled.View`
  align-items: center;
  flex-direction: row;
  margin-top: 8px;
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
