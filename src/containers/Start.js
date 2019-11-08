'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { saveMnemonic } from '../actions/ActionMnemonic';
import styled from 'styled-components';
import { View, Text } from 'react-native';
import {
  RootContainer,
  TouchableCardContainer,
  HeaderThree,
  Description,
  Loader
} from '../components/common/';
import WalletUtilities from '../utilities/WalletUtilities.ts';

class Start extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }

  async renderLoader() {
    this.setState({
      loading: true
    });

    const mnemonicWords = await WalletUtilities.getMnemonic();

    if (mnemonicWords) {
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
          <Description marginBottom="120" marginLeft="8" marginTop="240">
            Let's make your wallet first :)
          </Description>
          <TouchableCardContainer
            alignItems="center"
            flexDirection="row"
            height="160px"
            justifyContent="center"
            textAlign="left"
            width="90%"
            onPress={async () => {
              await WalletUtilities.init();
              await this.props.saveMnemonic();
              await this.renderLoader();
              this.props.navigation.navigate('CreateWalletTutorial');
            }}
          >
            <View>
              <HeaderThree marginBottom="0" marginLeft="0" marginTop="0">
                Create
              </HeaderThree>
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
              <HeaderThree marginBottom="0" marginLeft="0" marginTop="0">
                Import
              </HeaderThree>
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

const CardText = styled.Text`
  font-size: 16px;
  padding-top: 8px;
  padding-right: 32px;
  text-align: left;
`;

const CardImage = styled.Image`
  height: 64px;
  padding: 16px;
  resizeMode: contain;
  width: 64px;
`;

const mapDispatchToProps = {
  saveMnemonic
};

export default connect(
  null,
  mapDispatchToProps
)(Start);
