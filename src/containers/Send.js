'use strict';
import React, { Component } from 'react';
import { TouchableOpacity, ScrollView } from 'react-native';
import styled from 'styled-components';
import { RootContainer, Container, HeaderOne } from '../components/common';
import SendEth from '../components/Send/SendEth';
import SendDai from '../components/Send/SendDai';
import I18n from '../i18n/I18n';
import LogUtilities from '../utilities/LogUtilities.js';

export default class Send extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currency: 'eth'
    };
  }

  renderCurrency() {
    if (this.state.currency === 'eth') {
      return <SendEth />;
    } else if (this.state.currency === 'dai') {
      return <SendDai />;
    } else {
      LogUtilities.logInfo('no currency matches');
    }
  }

  render() {
    const tabs = [
      {
        event: () => this.setState({ currency: 'eth' }),
        opacity: this.state.currency === 'eth' ? 1 : 0.4,
        path: require('../../assets/ether_icon.png')
      },
      {
        event: () => this.setState({ currency: 'dai' }),
        opacity: this.state.currency === 'dai' ? 1 : 0.4,
        path: require('../../assets/dai_icon.png')
      },
      {
        event: () => this.setState({ currency: 'cdai' }),
        opacity: this.state.currency === 'cdai' ? 1 : 0.4,
        path: require('../../assets/cdai_icon.png')
      },
      {
        event: () => this.setState({ currency: 'pldai' }),
        opacity: this.state.currency === 'pldai' ? 1 : 0.4,
        path: require('../../assets/pldai_icon.png')
      },
    ]
    return (
      <RootContainer>
        <HeaderOne marginTop="64">{I18n.t('send')}</HeaderOne>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <Container
            alignItems="flex-end"
            flexDirection="row"
            justifyContent="center"
            marginTop={16}
            width="100%"
          >
            {tabs.map(tab =>
              <TouchableOpacity
                onPress={tab.event}
              >
                <CoinImage
                  opacity={tab.opacity}
                  source={tab.path}
                />
              </TouchableOpacity>
            )}
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
  opacity: ${(props) => props.opacity};
  width: 40px;
`;
