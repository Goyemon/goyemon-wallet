'use strict';
import Animation from 'lottie-react-native';
import React, { Component } from 'react';
import * as Animatable from 'react-native-animatable';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import styled from 'styled-components/native';
import Web3 from 'web3';
import { savePopUpModalVisibility } from '../actions/ActionModal';
import { togglePoolTogetherWinnerRevealed } from '../actions/ActionPoolTogether';
import Congrats from '../../assets/congrats_animation.json';
import {
  RootContainer,
  Button,
  Description,
  HeaderOne,
  HeaderFour,
  HeaderFive,
  GoyemonText
} from '../components/common';
import Countdown from './common/Countdown';
import PopUpModal from './common/PopUpModal';
import I18n from '../i18n/I18n';
import { FCMMsgs } from '../lib/fcm.js';
import PortfolioPoolTogetherOpen from './PortfolioPoolTogetherOpen';
import PortfolioPoolTogetherCommitted from './PortfolioPoolTogetherCommitted';
import LogUtilities from '../utilities/LogUtilities.js';
import { RoundDownBigNumber } from '../utilities/BigNumberUtilities';

class PortfolioPoolTogether extends Component {
  constructor(props) {
    super(props);
    this.state = {
      draw: 'open'
    };
  }

  componentDidMount() {
    FCMMsgs.requestPoolTogetherDaiInfo(this.props.checksumAddress);
    if (!this.props.poolTogether.winnerRevealed) {
      this.props.savePopUpModalVisibility(true);
    }
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

  renderCountdownHeader() {
    if (this.state.draw === 'open') {
      return (
        <CountdownContainer>
          <HeaderFive width="100%">until the open round ends</HeaderFive>
        </CountdownContainer>
      );
    } else if (this.state.draw === 'committed') {
      return (
        <CountdownContainer>
          <HeaderFive width="100%">until the next prize</HeaderFive>
        </CountdownContainer>
      );
    } else {
      LogUtilities.logInfo('no draw matches');
    }
  }

  renderModalContent() {
    const winningAmount = RoundDownBigNumber(
      this.props.poolTogether.dai.winningAmount,
      16
    )
      .div(new RoundDownBigNumber(10).pow(18))
      .toFixed(2);

    if (this.props.poolTogether.dai.lastWinner != '') {
      if (
        Web3.utils.toChecksumAddress(
          `0x${this.props.poolTogether.dai.lastWinner}`
        ) === this.props.checksumAddress
      ) {
        return (
          <PopUpModal
            height="40%"
            onPress={() => {
              this.props.savePopUpModalVisibility(false);
              this.props.togglePoolTogetherWinnerRevealed(true);
            }}
          >
            <AnimationContainer animation="fadeIn" delay={1000}>
              <HeaderFour marginTop={8}>
                you won {winningAmount} DAI!
              </HeaderFour>
              <Animation
                ref={(animation) => {
                  this.animation = animation;
                }}
                style={{
                  width: 120,
                  height: 120,
                  marginBottom: 12
                }}
                autoPlay
                loop={true}
                source={Congrats}
              />
            </AnimationContainer>
            <AnimationContainer animation="fadeIn" delay={2500}>
              <GoyemonText fontSize={16}>
                your winning is in the committed pool
              </GoyemonText>
              <GoyemonText fontSize={16}>
                you can keep it there or withdraw
              </GoyemonText>
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
                    this.props.togglePoolTogetherWinnerRevealed(true);
                    this.props.navigation.navigate(
                      'WithdrawDaiFromPoolTogether'
                    );
                  }}
                />
              </ButtonContainer>
            </AnimationContainer>
          </PopUpModal>
        );
      } else {
        return (
          <PopUpModal
            height="25%"
            onPress={() => {
              this.props.savePopUpModalVisibility(false);
              this.props.togglePoolTogetherWinnerRevealed(true);
            }}
          >
            <HeaderFour marginTop={8}>the last winner was...</HeaderFour>
            <AnimationContainer animation="fadeIn" delay={1000}>
              <GoyemonText fontSize={12}>
                {`0x${this.props.poolTogether.dai.lastWinner}`}
              </GoyemonText>
            </AnimationContainer>
            <AnimationContainer animation="fadeIn" delay={2500}>
              <Description marginBottom="8" marginLeft="8" marginTop="16">
                your deposit is still in the committed round for the next prize!
              </Description>
            </AnimationContainer>
          </PopUpModal>
        );
      }
    } else {
      LogUtilities.logInfo('the winning address is not saved');
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
          <FilterChoiceUnselected
            onPress={() => this.setState({ draw: 'open' })}
          >
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
      LogUtilities.logInfo('no matches');
    }
  }

  render() {
    return (
      <RootContainer>
        {this.renderModalContent()}
        <HeaderOne marginTop="112">PoolTogether</HeaderOne>
        <FilterContainer>{this.toggleFilterChoiceText()}</FilterContainer>
        {this.renderCountdownHeader()}
        <Countdown />
        {this.renderDraw()}
      </RootContainer>
    );
  }
}

const AnimationContainer = Animatable.createAnimatableComponent(styled.View`
  align-items: center;
  flex-direction: column;
  margin: 0 auto;
`);

const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-top: 16;
`;

const FilterContainer = styled.View`
  align-items: center;
  background-color: #eee;
  border-radius: 24px;
  flex-direction: row;
  justify-content: center;
  margin: 0 auto;
  margin-top: 16;
  margin-bottom: 12;
  width: 80%;
`;

const FilterChoiceContainer = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: flex-start;
`;

const FilterChoiceSelected = styled.TouchableOpacity`
  align-items: center;
  background-color: #fff;
  border-color: #fff;
  border-radius: 24px;
  border-width: 1;
  width: 50%;
`;

const FilterChoiceUnselected = styled.TouchableOpacity`
  align-items: center;
  background-color: #eee;
  border-color: #eee;
  border-radius: 24px;
  border-width: 1;
  width: 50%;
`;

const FilterChoiceTextSelected = styled.Text`
  color: #000;
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

const CountdownContainer = styled.View`
  align-items: center;
  flex-direction: column;
  margin: 0 auto;
`;

const mapStateToProps = (state) => ({
  balance: state.ReducerBalance.balance,
  checksumAddress: state.ReducerChecksumAddress.checksumAddress,
  poolTogether: state.ReducerPoolTogether.poolTogether
});

const mapDispatchToProps = {
  savePopUpModalVisibility,
  togglePoolTogetherWinnerRevealed
};

export default withNavigation(
  connect(mapStateToProps, mapDispatchToProps)(PortfolioPoolTogether)
);
