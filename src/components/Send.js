'use strict';
import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native';
import styled from 'styled-components';
import { RootContainer, Container, HeaderOne } from './common';
import SendEth from '../containers/SendEth';
import SendDai from '../containers/SendDai';
import LogUtilities from '../utilities/LogUtilities.js';

export default class Send extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currency: 'ether'
    };
  }

  renderCurrency() {
    if (this.state.currency === 'ether') {
      return <SendEth />;
    } else if (this.state.currency === 'dai') {
      return <SendDai />;
    } else {
      LogUtilities.logInfo('no currency matches');
    }
  }

  render() {
    return (
      <RootContainer>
        <HeaderOne marginTop="64">Send</HeaderOne>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <Container
            alignItems="flex-end"
            flexDirection="row"
            justifyContent="center"
            marginTop={16}
            width="100%"
          >
            <TouchableOpacity
              onPress={() => this.setState({ currency: 'ether' })}
            >
              <CoinImage source={require('../../assets/ether_icon.png')} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.setState({ currency: 'dai' })}
            >
              <CoinImage source={require('../../assets/dai_icon.png')} />
            </TouchableOpacity>
          </Container>
        </ScrollView>
        {this.renderCurrency()}
      </RootContainer>
    );
  }
}

const CoinImage = styled.Image`
  border-radius: 20px;
  margin-left: 16;
  height: 40px;
  width: 40px;
`;
