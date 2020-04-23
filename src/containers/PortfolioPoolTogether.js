'use strict';
import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import { savePopUpModalVisibility } from '../actions/ActionModal';
import {
  RootContainer,
  Button,
  Container,
  HeaderOne,
  GoyemonText
} from '../components/common';
import PopUpModal from './common/PopUpModal';
import PortfolioPoolTogetherNext from './PortfolioPoolTogetherNext';
import PortfolioPoolTogetherOngoing from './PortfolioPoolTogetherOngoing';
import LogUtilities from '../utilities/LogUtilities.js';

class PortfolioPoolTogether extends Component {
  constructor(props) {
    super(props);
    this.state = {
      draw: 'next'
    };
  }

  renderDraw() {
    if (this.state.draw === 'next') {
      return <PortfolioPoolTogetherNext />;
    } else if (this.state.draw === 'ongoing') {
      return <PortfolioPoolTogetherOngoing />;
    } else {
      LogUtilities.logInfo('no draw matches');
    }
  }

  renderModalContent() {
    if (this.props.poolTogether.dai.winner === this.props.checksumAddress) {
      return (
        <PopUpModal buttonText="withdraw your winning">
          <GoyemonText fontSize={16}>you won baby</GoyemonText>
        </PopUpModal>
      );
    } else {
      return (
        <PopUpModal buttonText="deposit for the next round">
          <GoyemonText fontSize={16}>sorry</GoyemonText>
        </PopUpModal>
      );
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
          <TouchableOpacity onPress={() => this.setState({ draw: 'next' })}>
            <GoyemonText fontSize={16}>next</GoyemonText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.setState({ draw: 'ongoing' })}>
            <GoyemonText fontSize={16}>ongoing</GoyemonText>
          </TouchableOpacity>
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
