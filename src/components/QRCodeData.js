import React, { Component } from 'react';
import { Text, Button, Clipboard, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationActions } from 'react-navigation';
import styled from 'styled-components/native';
import HomeStack from '../navigators/HomeStack';

export default class QRCodeData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      qrCodeData: '',
      scanner: undefined,
      clipboardContent: null
    };
  }

  async writeToClipboard() {
    await Clipboard.setString(this.state.qrCodeData);
    this.setState({ clipboardContent: this.state.qrCodeData });
  }

  renderCopyText() {
    if (this.state.clipboardContent === this.state.qrCodeData) {
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

  componentDidMount() {
    const qrCodeData = this.props.navigation.getParam('data', 'No data read');
    const scanner = this.props.navigation.getParam('scanner', () => false);

    this.setState({ qrCodeData, scanner });
  }

  scanQRCodeAgain() {
    this.state.scanner.reactivate();
    this.props.navigation.goBack();
  }

  render() {
    return (
      <Container>
        <Text>{this.state.qrCodeData}</Text>
        {this.renderCopyText()}
        <Button title={'Scan QRCode Again'} onPress={() => this.scanQRCodeAgain()} />
        <Button
          title={'Go Back to the Form'}
          onPress={() => {
            this.props.navigation.pop(2);
            HomeStack.navigationOptions = () => {
              const tabBarVisible = true;
              return {
                tabBarVisible
              };
            };
          }}
        />
      </Container>
    );
  }
}

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
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
