'use strict';
import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import { Modal, Alert } from 'react-native';
import styled from 'styled-components';
import {
  saveEarnModalVisibility,
  updateVisibleType
} from '../actions/ActionEarnModalVisibility';
import DepositDai from '../containers/DepositDai';
import WithdrawDai from '../containers/WithdrawDai';
import LogUtilities from '../utilities/LogUtilities.js';

class EarnModal extends Component {
  renderSendingComponent() {
    if (this.props.earnModal.type === 'depositDai') {
      return <DepositDai />;
    } else if (this.props.earnModal.type === 'withdrawDai') {
      return <WithdrawDai />;
    } else {
      LogUtilities.logInfo('no type matches ');
    }
  }

  render() {
    return (
      <Modal
        animationType="slide"
        transparent
        visible={this.props.earnModal.visibility}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
        }}
      >
        <ModalContainer>
          <ModalBackground>
            <CloseButton
              onPress={() => {
                this.props.saveEarnModalVisibility(false);
                this.props.updateVisibleType(null);
              }}
            >
              <Icon name="close" color="#5F5F5F" size={32} />
            </CloseButton>
            <MondalInner>{this.renderSendingComponent()}</MondalInner>
          </ModalBackground>
        </ModalContainer>
      </Modal>
    );
  }
}

const ModalContainer = styled.View`
  align-items: flex-end;
  background-color: rgba(0, 0, 0, 0.5);
  flex-direction: row;
  justify-content: center;
  height: 100%;
`;

const ModalBackground = styled.ScrollView`
  background-color: #f8f8f8;
  border-radius: 16px;
  height: 90%;
  min-height: 400px;
  width: 90%;
`;

const CloseButton = styled.TouchableOpacity`
  margin-left: 20;
  margin-top: 20;
`;

const MondalInner = styled.View`
  align-items: center;
  justify-content: center;
  flex: 1;
  flex-direction: column;
  margin-top: 40;
  width: 100%;
`;

function mapStateToProps(state) {
  return {
    earnModal: state.ReducerEarnModalVisibility.earnModal
  };
}

const mapDispatchToProps = {
  saveEarnModalVisibility,
  updateVisibleType
};

export default connect(mapStateToProps, mapDispatchToProps)(EarnModal);
