import React, { Component } from 'react';
import { Dimensions, BackHandler } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { connect } from 'react-redux';
import styled from 'styled-components/native';
import { saveQRCodeData } from '../actions/ActionQRCodeData';
import { Container } from '../components/common';
import I18n from '../i18n/I18n';
import SendStack from '../navigators/SendStack';

class QRCodeScan extends Component {
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleBackButton() {
    SendStack.navigationOptions = () => {
      const tabBarVisible = true;
      return {
        tabBarVisible
      };
    };
  }

  onScanSuccess = (e) => {
    this.props.saveQRCodeData(e.data);
    this.props.navigation.pop();

    SendStack.navigationOptions = () => {
      const tabBarVisible = true;
      return {
        tabBarVisible
      };
    };
  };

  render() {
    return (
      <Container
        alignItems="center"
        flexDirection="row"
        justifyContent="center"
        marginTop={0}
        width="100%"
      >
        <QRCodeScanner
          onRead={this.onScanSuccess}
          showMarker
          checkAndroid6Permissions
          cameraStyle={{ height: Dimensions.get('screen').height }}
          bottomContent={
            <GoBackContainer
              onPress={() => {
                SendStack.navigationOptions = () => {
                  const tabBarVisible = true;
                  return {
                    tabBarVisible
                  };
                };
                this.props.navigation.goBack();
              }}
            >
              <GoBackText>{I18n.t('go-back')}</GoBackText>
            </GoBackContainer>
          }
        />
      </Container>
    );
  }
}

const GoBackContainer = styled.TouchableOpacity`
  align-items: center;
  min-height: 120;
  width: 100%;
`;

const GoBackText = styled.Text`
  color: #fff;
`;

const mapDispatchToProps = {
  saveQRCodeData
};

export default connect(null, mapDispatchToProps)(QRCodeScan);
