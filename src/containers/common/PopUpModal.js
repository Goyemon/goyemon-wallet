'use strict';
import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import { Alert, Modal } from 'react-native';
import styled from 'styled-components/native';
import { savePopUpModalVisibility } from '../../actions/ActionModal';
import { RootContainer } from '../../components/common';

class PopUpModal extends Component {
  render() {
    return (
      <RootContainer>
        <Modal
          animationType="fade"
          transparent
          visible={this.props.modal.popUpModalVisibility}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}
        >
          <ModalContainer>
            <ModalBackground>
              <MondalInner>
                <CloseButton
                  onPress={() => {
                    this.props.savePopUpModalVisibility(false);
                  }}
                >
                  <Icon name="close" color="#5F5F5F" size={24} />
                </CloseButton>
                {this.props.children}
              </MondalInner>
            </ModalBackground>
          </ModalContainer>
        </Modal>
      </RootContainer>
    );
  }
}

const ModalContainer = styled.View`
  background-color: rgba(0, 0, 0, 0.5);
  flex-direction: row;
  justify-content: center;
  height: 100%;
`;

const ModalBackground = styled.View`
  background-color: #f8f8f8;
  border-radius: 16px;
  height: 40%;
  min-height: 320px
  margin-top: 80;
  width: 90%;
`;

const MondalInner = styled.View`
  justify-content: center;
  flex: 1;
  flex-direction: column;
  width: 100%;
`;

const CloseButton = styled.TouchableOpacity`
  margin-left: 16;
`;

function mapStateToProps(state) {
  return {
    modal: state.ReducerModal.modal
  };
}

const mapDispatchToProps = {
  savePopUpModalVisibility
};

export default connect(mapStateToProps, mapDispatchToProps)(PopUpModal);
