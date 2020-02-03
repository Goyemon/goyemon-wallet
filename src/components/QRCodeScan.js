import React, { Component } from 'react';
import { Dimensions } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { NavigationActions } from 'react-navigation';
import styled from 'styled-components/native';
import HomeStack from '../navigators/HomeStack';

class QRCodeScan extends Component {
  componentDidMount() {
    HomeStack.navigationOptions = () => {
      const tabBarVisible = false;
      return {
        tabBarVisible
      };
    };
  }

  onScanSuccess = async e => {
    await this.props.navigation.navigate('QRCodeData', {
      data: e.data,
      scanner: this.scanner
    });
  };

  render() {
    return (
      <Container>
        <QRCodeScanner
          onRead={this.onScanSuccess}
          showMarker
          checkAndroid6Permissions
          ref={node => {
            this.scanner = node;
          }}
          cameraStyle={{ height: Dimensions.get('screen').height }}
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

export default QRCodeScan;
