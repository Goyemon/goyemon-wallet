import React, { Component } from 'react';
import { Dimensions, TouchableOpacity, Text } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import styled from 'styled-components/native';
import { saveQRCodeData } from '../actions/ActionQRCodeData';
import HomeStack from '../navigators/HomeStack';

class QRCodeScan extends Component {
  onScanSuccess = e => {
    this.props.saveQRCodeData(e.data);
    this.props.navigation.pop();

    HomeStack.navigationOptions = () => {
      const tabBarVisible = true;
      return {
        tabBarVisible
      };
    };
  };

  render() {
    return (
      <Container>
        <QRCodeScanner
          onRead={this.onScanSuccess}
          showMarker
          checkAndroid6Permissions
          cameraStyle={{ height: Dimensions.get('screen').height }}
          bottomContent={
            <GoBackContainer
              onPress={() => {
                HomeStack.navigationOptions = () => {
                  const tabBarVisible = true;
                  return {
                    tabBarVisible
                  };
                };
                this.props.navigation.goBack();
              }}
            >
              <GoBackText>go back</GoBackText>
            </GoBackContainer>
          }
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

export default connect(
  null,
  mapDispatchToProps
)(QRCodeScan);
