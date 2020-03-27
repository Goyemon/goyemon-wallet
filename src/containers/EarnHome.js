'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { withNavigation } from 'react-navigation';
import styled from 'styled-components';
import {
  saveEarnModalVisibility,
  updateVisibleType
} from '../actions/ActionEarnModalVisibility';
import CompoundIcon from '../../assets/CompoundIcon.js';
import {
  RootContainer,
  Container,
  TouchableCardContainer,
  HeaderOne,
  CrypterestText
} from '../components/common';
import EarnModal from '../components/EarnModal';

class EarnHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false
    };
  }

  render() {
    return (
      <RootContainer>
        <HeaderOne marginTop="64">Earn</HeaderOne>
        <EarnModal />
        <Container
          alignItems="flex-start"
          flexDirection="column"
          justifyContent="center"
          marginTop={16}
          width="100%"
        >
          <TouchableCardContainer
            alignItems="center"
            flexDirection="column"
            height="160px"
            justifyContent="center"
            textAlign="left"
            width="90%"
            onPress={() => {
              this.props.saveEarnModalVisibility(true);
              this.props.updateVisibleType('depositDai');
            }}
          >
            <CrypterestText fontSize={24}>
              Deposit DAI to Compound
            </CrypterestText>
            <IconImageContainer>
              <IconImage>
                <CardImage source={require('../../assets/dai_icon.png')} />
              </IconImage>
              <IconImage>
                <Icon name="arrow-right-bold" size={20} color="#5F5F5F" />
              </IconImage>
              <IconImage>
                <CompoundIcon />
              </IconImage>
            </IconImageContainer>
          </TouchableCardContainer>
          <TouchableCardContainer
            alignItems="center"
            flexDirection="column"
            height="160px"
            justifyContent="center"
            textAlign="left"
            width="90%"
            onPress={() => {
              this.props.saveEarnModalVisibility(true);
              this.props.updateVisibleType('withdrawDai');
            }}
          >
            <CrypterestText fontSize={24}>
              Withdraw DAI from Compound
            </CrypterestText>
            <IconImageContainer>
              <IconImage>
                <CardImage source={require('../../assets/dai_icon.png')} />
              </IconImage>
              <IconImage>
                <Icon name="arrow-left-bold" size={20} color="#5F5F5F" />
              </IconImage>
              <IconImage>
                <CompoundIcon />
              </IconImage>
            </IconImageContainer>
          </TouchableCardContainer>
        </Container>
      </RootContainer>
    );
  }
}

const IconImageContainer = styled.View`
  align-items: center;
  flex-direction: row;
  margin-top: 16;
`;

const IconImage = styled.View`
  margin-left: 8;
  margin-right: 8;
`;

const CardImage = styled.Image`
  height: 40px;
  padding: 16px;
  resize-mode: contain;
  width: 40px;
`;

const mapDispatchToProps = {
  saveEarnModalVisibility,
  updateVisibleType
};

export default withNavigation(connect(null, mapDispatchToProps)(EarnHome));
