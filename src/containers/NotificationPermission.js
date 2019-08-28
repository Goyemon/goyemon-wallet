'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { RootContainer, ProgressBar, Button } from '../components/common';
import { Text, View, Linking } from 'react-native';
import styled from 'styled-components/native';
import firebase from 'react-native-firebase';
import { saveNotificationPermission } from '../actions/ActionNotificationPermission';

class NotificationPermission extends Component {
  async componentDidMount() {
    await this.checkFcmPermissions();
  }

  async checkFcmPermissions() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      console.log('user has permissions');
      this.props.saveNotificationPermission(true);
    } else {
      console.log("user doesn't have permission");
      try {
        await firebase.messaging().requestPermission();
        this.props.saveNotificationPermission(true);
        console.log('User has authorised');
      } catch (error) {
        console.log('User has rejected permissions');
        this.props.saveNotificationPermission(false);
      }
    }
  }

  renderPermission() {
    if (this.props.permission === null) {
      return <Text>don't return anything</Text>;
    } else if (this.props.permission === true) {
      return (
        <Button
          text="Next"
          textColor="white"
          backgroundColor="#4083FF"
          margin="16px auto"
          opacity="1"
          onPress={() => this.props.navigation.navigate('Wallets')}
        />
      );
    } else if (this.props.permission === false) {
      return (
        <View>
          <Text>please go to the setting and change your permission. relaunch your app.</Text>
          <Button
            text="Go To Settings"
            textColor="#4E4E4E"
            backgroundColor="#EEEEEE"
            margin="16px auto"
            opacity="1"
            onPress={() => Linking.openURL('app-settings://notification/DeBank')}
          />
        </View>
      );
    }
  }

  render() {
    return (
      <RootContainer>
        <ProgressBar
          text="3"
          width="100%"
        />
        <Container>
          <View>{this.renderPermission()}</View>
        </Container>
      </RootContainer>
    );
  }
}

const Container = styled.View`
  flex: 1;
  justify-content: center;
  margin-top: 240px;
  text-align: center;
`;


function mapStateToProps(state) {
  return {
    permission: state.ReducerNotificationPermission.permission
  };
}
const mapDispatchToProps = {
  saveNotificationPermission
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NotificationPermission);
