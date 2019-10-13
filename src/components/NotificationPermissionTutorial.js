'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { RootContainer, ProgressBar, Button, OneLiner } from '../components/common';
import { Text } from 'react-native';
import { saveEthBalance } from '../actions/ActionBalance';
import styled from 'styled-components/native';
import firebase from 'react-native-firebase';

class NotificationPermissionTutorial extends Component {
  async componentDidMount() {
    this.messageListener = firebase.messaging().onMessage(downstreamMessage => {
      if (downstreamMessage.data.type === 'balance') {
        const balanceInWei = downstreamMessage.data.balance;
        const balanceInEther = this.props.web3.utils.fromWei(balanceInWei);
        const roundedBalanceInEther = parseFloat(balanceInEther).toFixed(4);
        this.props.saveEthBalance(roundedBalanceInEther);
      }
    });
  }

  componentWillUnmount() {
    this.messageListener();
  }

  render() {
    return (
      <RootContainer>
        <ProgressBar text="3" width="100%" />
        <OneLiner fontSize="24px" fontWeight="bold" marginBottom="0" marginLeft="0" marginTop="40">
          Allow Notifications
        </OneLiner>
        <Container>
          <Text>I need to ask you only one more thing…</Text>
          <Text>
            We use a notification system to process your transactions. But we will never annoy you
            with a pop-up notification.{' '}
          </Text>
          <Button
            text="Allow"
            textColor="white"
            backgroundColor="#009DC4"
            margin="16px auto"
            opacity="1"
            onPress={() => this.props.navigation.navigate('NotificationPermission')}
          />
        </Container>
      </RootContainer>
    );
  }
}

const Container = styled.View`
  flex: 1;
  justify-content: center;
  margin-top: 40px;
  text-align: center;
`;

const mapStateToProps = state => ({
    web3: state.ReducerWeb3.web3
  });

const mapDispatchToProps = {
  saveEthBalance
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NotificationPermissionTutorial);
