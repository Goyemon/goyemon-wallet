'use strict';
import Animation from 'lottie-react-native';
import React, { Component } from 'react';
import * as Animatable from 'react-native-animatable';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import styled from 'styled-components/native';
import { savePopUpModalVisibility } from '../actions/ActionModal';
import Congrats from '../../assets/congrats_animation.json';
import {
  RootContainer,
  Button,
  Container,
  HeaderOne,
  GoyemonText
} from '../components/common';
import PopUpModal from './common/PopUpModal';
import I18n from '../i18n/I18n';
import { FCMMsgs } from '../lib/fcm.js';
import PortfolioPoolTogetherOpen from './PortfolioPoolTogetherOpen';
import PortfolioPoolTogetherCommitted from './PortfolioPoolTogetherCommitted';
import LogUtilities from '../utilities/LogUtilities.js';

class PortfolioPoolTogether extends Component {
  constructor(props) {
    super(props);
    this.state = {
      draw: 'open'
    };
  }

  componentDidMount() {
    FCMMsgs.requestPoolTogetherDaiInfo(this.props.checksumAddress);
  }

  renderDraw() {
    if (this.state.draw === 'open') {
      return <PortfolioPoolTogetherOpen />;
    } else if (this.state.draw === 'committed') {
      return <PortfolioPoolTogetherCommitted />;
    } else {
      LogUtilities.logInfo('no draw matches');
    }
  }

  renderModalContent() {
    if (this.props.poolTogether.dai.winner === this.props.checksumAddress) {
      return (
        <PopUpModal>
          <AnimationContainer animation="fadeIn" delay={1500}>
            <Animation
              ref={(animation) => {
                this.animation = animation;
              }}
              style={{
                width: 120,
                height: 120
              }}
              autoPlay
              loop={true}
              source={Congrats}
            />
            <GoyemonText fontSize={16}>you won baby!</GoyemonText>
          </AnimationContainer>
          <AnimationContainer animation="fadeIn" delay={3000}>
            <GoyemonText fontSize={16}>
              your winning is staying in the current pool
            </GoyemonText>
            <GoyemonText fontSize={16}>you can keep it or withdraw</GoyemonText>
            <ButtonContainer>
              <Button
                text={I18n.t('withdraw')}
                textColor="#00A3E2"
                backgroundColor="#FFF"
                borderColor="#00A3E2"
                margin="8px auto"
                marginBottom="12px"
                opacity="1"
                onPress={async () => {
                  this.props.savePopUpModalVisibility(false);
                  this.props.navigation.navigate('WithdrawDaiFromPoolTogether');
                }}
              />
            </ButtonContainer>
          </AnimationContainer>
        </PopUpModal>
      );
    } else {
      return (
        <PopUpModal>
          <AnimationContainer animation="fadeIn" delay={1500}>
            <GoyemonText fontSize={16}>the last winner was...</GoyemonText>
            <GoyemonText fontSize={16}>
              {this.props.poolTogether.dai.winner}
            </GoyemonText>
            <GoyemonText fontSize={16}>
              your last deposit stays in the committed pool
            </GoyemonText>
            <GoyemonText fontSize={16}>
              you can deposit for the next round
            </GoyemonText>
            <ButtonContainer>
              <Button
                text={I18n.t('deposit')}
                textColor="#00A3E2"
                backgroundColor="#FFF"
                borderColor="#00A3E2"
                margin="8px auto"
                marginBottom="12px"
                opacity="1"
                onPress={async () => {
                  this.props.savePopUpModalVisibility(false);
                  this.props.navigation.navigate('DepositDaiToPoolTogether');
                }}
              />
            </ButtonContainer>
          </AnimationContainer>
        </PopUpModal>
      );
    }
  }

  toggleFilterChoiceText() {
    if (this.state.draw === 'open') {
      return (
        <FilterChoiceContainer>
          <FilterChoiceSelected onPress={() => this.setState({ draw: 'open' })}>
            <FilterChoiceTextSelected>open</FilterChoiceTextSelected>
          </FilterChoiceSelected>
          <FilterChoiceUnselected
            onPress={() => this.setState({ draw: 'committed' })}
          >
            <FilterChoiceTextUnselected>committed</FilterChoiceTextUnselected>
          </FilterChoiceUnselected>
        </FilterChoiceContainer>
      );
    } else if (this.state.draw === 'committed') {
      return (
        <FilterChoiceContainer>
          <FilterChoiceUnselected onPress={() => this.setState({ draw: 'open' })}>
            <FilterChoiceTextUnselected>open</FilterChoiceTextUnselected>
          </FilterChoiceUnselected>
          <FilterChoiceSelected
            onPress={() => this.setState({ draw: 'committed' })}
          >
            <FilterChoiceTextSelected>committed</FilterChoiceTextSelected>
          </FilterChoiceSelected>
        </FilterChoiceContainer>
      );
    } else {
      console.log('no matches');
    }
  }

  render() {
    return (
      <RootContainer>
        {this.renderModalContent()}
        <HeaderOne marginTop="112">PoolTogether</HeaderOne>
        <Container
          alignItems="center"
          flexDirection="row"
          justifyContent="center"
          marginTop={16}
          width="100%"
        >
          {this.toggleFilterChoiceText()}
        </Container>
        {this.renderDraw()}
        <Button
          text="reveal the last result"
          textColor="#00A3E2"
          backgroundColor="#FFF"
          borderColor="#00A3E2"
          margin="8px auto"
          marginBottom="12px"
          opacity="1"
          onPress={() => {
            this.props.savePopUpModalVisibility(true);
          }}
        />
      </RootContainer>
    );
  }
}

const AnimationContainer = Animatable.createAnimatableComponent(styled.View`
  align-items: center;
  flex-direction: column;
`);

const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-top: 16;
`;

const FilterChoiceContainer = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: flex-start;
  margin-top: 24;
  margin-bottom: 12;
  margin-left: 16;
`;

const FilterChoiceSelected = styled.TouchableOpacity`
  background-color: #000;
  border-color: #000;
  border-radius: 24px;
  border-width: 1;
  margin-left: 4px;
  margin-right: 4px;
`;

const FilterChoiceUnselected = styled.TouchableOpacity`
  background-color: #fff;
  border-color: #fff;
  border-radius: 24px;
  border-width: 1;
  margin-left: 4px;
  margin-right: 4px;
`;

const FilterChoiceTextSelected = styled.Text`
  color: #fff;
  font-size: 20;
  font-weight: bold;
  padding: 4px 12px;
`;

const FilterChoiceTextUnselected = styled.Text`
  color: #000;
  font-size: 20;
  font-weight: bold;
  opacity: 0.4;
  padding: 4px 16px;
`;

const mapStateToProps = (state) => ({
  balance: state.ReducerBalance.balance,
  checksumAddress: state.ReducerChecksumAddress.checksumAddress,
  poolTogether: state.ReducerPoolTogether.poolTogether
});

const mapDispatchToProps = {
  savePopUpModalVisibility
};

export default withNavigation(
  connect(mapStateToProps, mapDispatchToProps)(PortfolioPoolTogether)
);
