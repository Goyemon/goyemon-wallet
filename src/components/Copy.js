'use strict';
import React, { Component } from 'react';
import * as Animatable from 'react-native-animatable';
import { connect } from 'react-redux';
import { Clipboard } from 'react-native';
import styled from 'styled-components/native';
import { CopyIcon } from './common';

class Copy extends Component {
  constructor() {
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

  render() {
    const handleViewRef = (ref) => (this.view = ref);
    return (
      <CopyAddressContainer>
        {this.props.animation &&
        this.state.clipboardContent === this.props.text ? (
          <CopyAnimation ref={handleViewRef}>❤️</CopyAnimation>
        ) : (
          <CopyAnimation ref={handleViewRef}></CopyAnimation>
        )}
        <CopyAddress
          onPress={async () => {
            await this.writeToClipboard(this.props.text);
            this.fadeOutUp();
          }}
        >
          {this.props.icon ? <CopyIcon /> : null}
          <CopyAddressText>
            {this.state.clipboardContent === this.props.text
              ? 'Copied'
              : 'Copy'}
          </CopyAddressText>
        </CopyAddress>
      </CopyAddressContainer>
    );
  }
}

const CopyAddressContainer = styled.View`
  align-items: center;
  flex-direction: column;
  justify-content: center;
`;

const CopyAnimation = Animatable.createAnimatableComponent(styled.Text``);

const CopyAddress = styled.TouchableOpacity`
  align-items: center;
  flex-direction: column;
`;

const CopyAddressText = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  font-size: 14;
`;

function mapStateToProps(state) {
  return {
    checksumAddress: state.ReducerChecksumAddress.checksumAddress
  };
}

export default connect(mapStateToProps)(Copy);
