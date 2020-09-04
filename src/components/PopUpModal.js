"use strict";
import React, { Component } from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { connect } from "react-redux";
import Modal from "react-native-modal";
import styled from "styled-components/native";

class PopUpModal extends Component {
  render() {
    return (
      <Modal
        animationIn="fadeIn"
        animationOut="fadeOut"
        isVisible={this.props.modal.popUpModalVisibility}
        style={{ flexDirection: "row", alignItems: "center" }}
      >
        <ModalContainer>
          <CloseButton onPress={this.props.onPress}>
            <Icon name="close" color="#5F5F5F" size={24} />
          </CloseButton>
          {this.props.children}
        </ModalContainer>
      </Modal>
    );
  }
}

const ModalContainer = styled.View`
  background-color: #f8f8f8;
  border-radius: 16px;
`;

const CloseButton = styled.TouchableOpacity`
  align-items: flex-start;
  margin-left: 16;
  margin-top: 16;
`;

function mapStateToProps(state) {
  return {
    modal: state.ReducerModal.modal
  };
}

export default connect(mapStateToProps)(PopUpModal);
