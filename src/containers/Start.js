'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { saveMnemonic } from '../actions/ActionMnemonic';
import styled from 'styled-components';
import { View } from 'react-native';
import { RootContainer, TouchableCardContainer, HeaderTwo, Loader } from '../components/common/';
import WalletController from '../wallet-core/WalletController.ts';

class Start extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    }
  }

  async renderLoader() {
    this.setState({
      loading: true
    });

    const mnemonic = await WalletController.getMnemonic();

    if(mnemonic){
      this.setState({
        loading: false
      });
    }
  }

  render() {
    return (
      <RootContainer>
        <Loader loading={this.state.loading} />
        <Container>
          <Logo>Swarm</Logo>
          <OneLiner>a permissionless bank  in your pocket</OneLiner>
          <TouchableCardContainer
            alignItems="center"
            flexDirection="row"
            height="160px"
            justifyContent="center"
            textAlign="left"
            width="90%"
            onPress={async () => {
              await this.props.saveMnemonic();
              await this.renderLoader();
              this.props.navigation.navigate('ShowMnemonic');
            }}
          >
            <View>
              <HeaderTwo color="#000" fontSize="16px" marginBottom="0" marginLeft="0" marginTop="0">
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
            height="160px"
            justifyContent="center"
            textAlign="left"
            width="90%"
            onPress={() => this.props.navigation.navigate('ImportOptions')}
          >
            <View>
              <HeaderTwo color="#000" fontSize="16px" marginBottom="0" marginLeft="0" marginTop="0">
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
  margin-bottom: 40px;
  text-align: center;
`;

const OneLiner = styled.Text`
  font-size: 32px;
  margin: 16px;
  text-align: center;
`;

const CardText = styled.Text`
  font-size: 16px;
  padding-top: 8px;
  text-align: left;
`;

const CardImage = styled.Image`
  padding: 16px;
`;

const mapDispatchToProps = {
  saveMnemonic
};

export default connect(
  null,
  mapDispatchToProps
)(Start);
