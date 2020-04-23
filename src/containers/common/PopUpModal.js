'use strict';
import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import { Alert, Modal } from 'react-native';
import styled from 'styled-components/native';
import { savePopUpModalVisibility } from '../../actions/ActionModal';
import { RootContainer, Button } from '../../components/common';
import I18n from '../../i18n/I18n';

class PopUpModal extends Component {
  render() {
    const { navigation } = this.props;
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
                  <Icon name="chevron-down" color="#5F5F5F" size={24} />
                </CloseButton>
                {this.props.children}
                <ButtonContainer>
                  <Button
                    text={this.props.buttonText}
                    textColor="#00A3E2"
                    backgroundColor="#FFF"
                    borderColor="#00A3E2"
                    margin="8px auto"
                    marginBottom="12px"
                    opacity="1"
                    onPress={async () => {
                      this.props.savePopUpModalVisibility(false);
                      navigation.navigate('');
                    }}
                  />
                </ButtonContainer>
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
  margin-top: 16;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-top: 16;
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
