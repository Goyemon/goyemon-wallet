'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Image } from 'react-native';
import { RootContainer, ProgressBar, Button, HeaderTwo, Description } from '../components/common';
import styled from 'styled-components/native';
import { getEthPrice, getDaiPrice } from '../actions/ActionPrice';

class NotificationPermissionTutorial extends Component {
  render() {
    return (
      <RootContainer>
      <ProgressBar oneColor="#5f5f5f" twoColor="#5f5f5f" threeColor="#5f5f5f" marginRight="0%" width="80%" />
      <Container>
        <HeaderTwo marginBottom="0" marginLeft="0" marginTop="0">
          Almost done!
        </HeaderTwo>
          <NotificationPermissionImage source={require('../../assets/notification_tutorial.png')} />
          <Description marginBottom="8" marginLeft="0" marginTop="16">
            We use a notification system to process your transactions.
          </Description>
          <Button
            text="Enable Now"
            textColor="#009DC4"
            backgroundColor="#FFF"
            borderColor="#009DC4"
            margin="16px auto"
            opacity="1"
            onPress={async () => {
              await this.props.getEthPrice();
              await this.props.getDaiPrice();
              this.props.navigation.navigate('NotificationPermission');
            }}
          />
        </Container>
      </RootContainer>
    );
  }
}

const Container = styled.View`
  alignItems: center;
  flex: 1;
  justify-content: center;
  margin-top: 40px;
  text-align: center;
`;

const NotificationPermissionImage = styled.Image`
  height: 320px;
  width: 320px;
`;

const mapStateToProps = state => ({
  web3: state.ReducerWeb3.web3
});

const mapDispatchToProps = {
  getEthPrice,
  getDaiPrice
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NotificationPermissionTutorial);
