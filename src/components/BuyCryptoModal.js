"use strict";
import React, { Component } from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { connect } from "react-redux";
import Modal from "react-native-modal";
import styled from "styled-components/native";
import { saveBuyCryptoModalVisibility } from "../actions/ActionModal";
import MoonPayWebView from "./Portfolio/BuyCrypto/MoonPayWebView";

class BuyCryptoModal extends Component {
  render() {
    return (
      <Modal
        animationIn="slideInUp"
        animationOut="slideOutDown"
        isVisible={this.props.modal.buyCryptoModalVisibility}
        onBackdropPress={() => {
          this.props.saveBuyCryptoModalVisibility(false);
        }}
        style={{
          marginLeft: 4,
          marginRight: 4,
          marginBottom: 0,
          flexDirection: "row",
          alignItems: "flex-end"
        }}
      >
        <ModalContainer>
          <CloseButton
            onPress={() => {
              this.props.saveBuyCryptoModalVisibility(false);
            }}
          >
            <Icon name="close" color="#5F5F5F" size={24} />
          </CloseButton>
          <MoonPayWebView />
        </ModalContainer>
      </Modal>
    );
  }
}

const ModalContainer = styled.View`
  background-color: #fff;
  border-radius: 16px;
  width: 100%;
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

const mapDispatchToProps = {
  saveBuyCryptoModalVisibility
};

export default connect(mapStateToProps, mapDispatchToProps)(BuyCryptoModal);
