'use strict';
import React, { Component } from 'react';
import { StackActions, NavigationActions } from 'react-navigation';
import { RootContainer } from '../components/common';
import styled from 'styled-components/native';
import { connect } from 'react-redux';
import * as Animatable from 'react-native-animatable';
import { getMnemonic } from '../actions/ActionMnemonic';
import { saveWeb3 } from '../actions/ActionWeb3';
import WalletController from '../wallet-core/WalletController.ts';

class Initial extends Component {
  async componentWillMount() {
    const privateKeySaved = await WalletController.privateKeySaved();
    const mainPage = privateKeySaved ? 'Wallets' : 'Welcome';
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: mainPage })]
    });
    this.props.navigation.dispatch(resetAction);
    this.props.saveWeb3();
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
