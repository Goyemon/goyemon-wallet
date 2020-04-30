'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styled from 'styled-components';
import {
  saveDaiCompoundApproval,
  saveDaiPoolTogetherApproval
} from '../actions/ActionApproval';
import CompoundIcon from '../../assets/CompoundIcon.js';
import PoolTogetherIcon from '../../assets/PoolTogetherIcon.js';
import {
  RootContainer,
  Container,
  TouchableCardContainer,
  HeaderOne,
  GoyemonText
} from '../components/common';
import I18n from '../i18n/I18n';
import TxStorage from '../lib/tx.js';
import LogUtilities from '../utilities/LogUtilities';

class EarnHome extends Component {
  componentDidMount() {
    LogUtilities.toDebugScreen('EarnHome componentDidMount() called');
    const txChangeCallback = (() => {
      TxStorage.storage.isDAIApprovedForCDAI().then((x) => {
        this.props.saveDaiCompoundApproval(x);
      });
      TxStorage.storage.isDAIApprovedForPT().then((x) => {
        this.props.saveDaiPoolTogetherApproval(x);
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
    const { navigation, approval } = this.props;

    return (
      <RootContainer>
        <HeaderOne marginTop="64">{I18n.t('earn')}</HeaderOne>
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
              if (approval.dai.compound) {
                navigation.navigate('DepositDaiToCompound');
              } else if (!approval.dai.compound) {
                navigation.navigate('DepositFirstDaiToCompound');
              } else {
                LogUtilities.logInfo('invalid approval value');
              }
            }}
          >
            <GoyemonText fontSize={24}>
              {I18n.t('earn-home-compound-deposit')}
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
              navigation.navigate('WithdrawDaiFromCompound');
            }}
          >
            <GoyemonText fontSize={24}>
              {I18n.t('earn-home-compound-withdraw')}
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
          <TouchableCardContainer
            alignItems="center"
            flexDirection="column"
            height="160px"
            justifyContent="center"
            textAlign="left"
            width="90%"
            onPress={() => {
              if (approval.dai.pooltogether) {
                navigation.navigate('DepositDaiToPoolTogether');
              } else if (!approval.dai.pooltogether) {
                navigation.navigate('DepositFirstDaiToPoolTogether');
              } else {
                LogUtilities.logInfo('invalid approval value');
              }
            }}
          >
            <GoyemonText fontSize={24}>
              {I18n.t('earn-home-pooltogether-deposit')}
            </GoyemonText>
            <IconImageContainer>
              <IconImage>
                <CardImage source={require('../../assets/dai_icon.png')} />
              </IconImage>
              <IconImage>
                <Icon name="arrow-right-bold" size={20} color="#5F5F5F" />
              </IconImage>
              <IconImage>
                <PoolTogetherIcon />
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
              navigation.navigate('WithdrawDaiFromPoolTogether');
            }}
          >
            <GoyemonText fontSize={24}>
              {I18n.t('earn-home-pooltogether-withdraw')}
            </GoyemonText>
            <IconImageContainer>
              <IconImage>
                <CardImage source={require('../../assets/dai_icon.png')} />
              </IconImage>
              <IconImage>
                <Icon name="arrow-left-bold" size={20} color="#5F5F5F" />
              </IconImage>
              <IconImage>
                <PoolTogetherIcon />
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
    approval: state.ReducerApproval.approval
  };
}

const mapDispatchToProps = {
  saveDaiCompoundApproval,
  saveDaiPoolTogetherApproval
};

export default withNavigation(
  connect(mapStateToProps, mapDispatchToProps)(EarnHome)
);
