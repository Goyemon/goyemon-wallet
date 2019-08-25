'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { RootContainer, Button } from '../components/common';
import { Text, View } from 'react-native';
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
          onPress={() => this.props.navigation.navigate('Start')}
        />
      );
    } else if (this.props.permission === false) {
      return (
        <View>
          <Button
            text="Next"
            textColor="white"
            backgroundColor="#4083FF"
            margin="16px auto"
            opacity="0.3"
            onPress={() => this.props.navigation.navigate('Start')}
            disabled={true}
          />
          <Text>please go to the setting and change your permission. relaunch your app.</Text>
        </View>
      );
    }
  }

  render() {
    return (
      <RootContainer>
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
