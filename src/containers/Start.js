'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getMnemonic } from '../actions/ActionMnemonic';
import styled from 'styled-components';
import { View, Image } from 'react-native';
import { RootContainer, TouchableCardContainer, HeaderOne, HeaderTwo } from '../components/common/';

class Start extends Component {
  render() {
    return (
      <RootContainer>
        <Container>
          <Logo>DeBank</Logo>
          <OneLiner>a permissionless bank  in your pocket</OneLiner>
          <TouchableCardContainer
            alignItems="center"
            flexDirection="row"
            height="200px"
            justifyContent="center"
            textAlign="left"
            width="90%"
            onPress={async () => {
              await this.props.getMnemonic();
              this.props.navigation.navigate('ShowMnemonic');
            }}
          >
            <View>
              <HeaderTwo fontSize="16px" marginBottom="0" marginTop="0">
                Create
              </HeaderTwo>
              <CardText>new wallet</CardText>
            </View>
            <View>
              <CardImage source={require('../../assets/create_wallet_icon.png')} />
            </View>
          </TouchableCardContainer>
          <TouchableCardContainer
            alignItems="center"
            flexDirection="row"
            height="200px"
            justifyContent="center"
            textAlign="left"
            width="90%"
            onPress={() => this.props.navigation.navigate('Import')}
          >
            <View>
              <HeaderTwo fontSize="16px" marginBottom="0" marginTop="0">
                Import
              </HeaderTwo>
              <CardText>existing wallet</CardText>
            </View>
            <View>
              <CardImage source={require('../../assets/import_wallet_icon.png')} />
            </View>
          </TouchableCardContainer>
        </Container>
      </RootContainer>
    );
  }
}

const Container = styled.ScrollView.attrs(props => ({
  contentContainerStyle: props => ({
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center'
  })
}))``;

const Logo = styled.Text`
  font-size: 48px;
  font-family: 'Arimo';
  margin-top: 96px;
  text-align: center;
`;

const OneLiner = styled.Text`
  font-size: 32px;
  margin: 16px;
  text-align: center;
`;

const CardText = styled.Text`
  font-size: 16px;
  padding: 16px;
  text-align: left;
`;

const CardImage = styled.Image`
  padding: 16px;
`;

const mapDispatchToProps = {
  getMnemonic
};

export default connect(
  null,
  mapDispatchToProps
)(Start);
