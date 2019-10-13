'use strict';
import React, { Component } from 'react';
import { StackActions, NavigationActions } from 'react-navigation';
import { RootContainer } from '../components/common';
import styled from 'styled-components/native';
import { connect } from 'react-redux';
import * as Animatable from 'react-native-animatable';
import { saveWeb3 } from '../actions/ActionWeb3';
import WalletUtilities from '../utilities/WalletUtilities.ts';
import HomeStack from '../navigators/HomeStack';
import firebase from 'react-native-firebase';

class Initial extends Component {
  async componentWillMount() {
    await this.props.saveWeb3();
    const privateKeySaved = await WalletUtilities.privateKeySaved();
    const notificationEnabled = await firebase.messaging().hasPermission();
    let mainPage = 'Welcome';

    if (privateKeySaved && notificationEnabled) {
      mainPage = 'Wallets';
    } else if (privateKeySaved && !notificationEnabled) {
      mainPage = 'NotificationPermission';
    } else if (!privateKeySaved && !notificationEnabled) {
      mainPage = 'Welcome';
    }

    HomeStack.navigationOptions = ({ navigation }) => {
      let tabBarVisible = true;
      if (navigation.state.index >= 0 && mainPage === 'Welcome') {
        tabBarVisible = false;
      }

      return {
        tabBarVisible
      };
    };

    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: mainPage })]
    });
    this.props.navigation.dispatch(resetAction);
  }

  render() {
    return (
      <RootContainer>
        <Container>
          <Title animation="fadeIn" delay={2000}>
            loading
          </Title>
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

const Title = Animatable.createAnimatableComponent(styled.Text`
  font-size: 40px;
  margin-bottom: 16px;
  text-align: center;
`);

const mapDispatchToProps = {
  saveWeb3
};

export default connect(
  null,
  mapDispatchToProps
)(Initial);
