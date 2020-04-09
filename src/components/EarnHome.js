'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styled from 'styled-components';
import { saveDaiCompoundApproval } from '../actions/ActionApproval';
import CompoundIcon from '../../assets/CompoundIcon.js';
import {
  RootContainer,
  Container,
  TouchableCardContainer,
  HeaderOne,
  GoyemonText
} from './common';
import TxStorage from '../lib/tx.js';
import LogUtilities from '../utilities/LogUtilities';

class EarnHome extends Component {
  componentDidMount() {
    LogUtilities.toDebugScreen('EarnHome componentDidMount() called');
    const txChangeCallback = (() => {
      TxStorage.storage.isDAIApprovedForCDAI().then(x => {
        this.props.saveDaiCompoundApproval(x);
      });
    }).bind(this);

    this.unsub = TxStorage.storage.subscribe(txChangeCallback);
    txChangeCallback();
  }

  componentWillUnmount() {
    LogUtilities.toDebugScreen('EarnHome componentWillUnmount() called');
    this.unsub();
  }

  render() {
    return (
      <RootContainer>
        <HeaderOne marginTop="64">Earn</HeaderOne>
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
              if (this.props.approval.dai.compound) {
                this.props.navigation.navigate('DepositDai');
              } else if (!this.props.approval.dai.compound) {
                this.props.navigation.navigate('DepositFirstDai');
              } else {
                LogUtilities.logInfo('invalid approval value');
              }
            }}
          >
            <GoyemonText fontSize={24}>
              Deposit DAI to Compound
            </GoyemonText>
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
              this.props.navigation.navigate('WithdrawDai');
            }}
          >
            <GoyemonText fontSize={24}>
              Withdraw DAI from Compound
            </GoyemonText>
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

function mapStateToProps(state) {
  return {
    cDaiLendingInfo: state.ReducerCDaiLendingInfo.cDaiLendingInfo,
    approval: state.ReducerApproval.approval
  };
}

const mapDispatchToProps = {
  saveDaiCompoundApproval
};

export default withNavigation(
  connect(mapStateToProps, mapDispatchToProps)(EarnHome)
);
