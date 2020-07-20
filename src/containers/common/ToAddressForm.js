'use strict';
import React, { Component } from 'react';
import { withNavigation } from 'react-navigation';
import { connect } from 'react-redux';
import { View, Clipboard } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styled from 'styled-components/native';
import Web3 from 'web3';
import { saveOutgoingTransactionDataSend } from '../../actions/ActionOutgoingTransactionData';
import { clearQRCodeData } from '../../actions/ActionQRCodeData';
import { updateToAddressValidation } from '../../actions/ActionTxFormValidation';
import { Form, FormHeader } from '../../components/common';
import I18n from '../../i18n/I18n';
import SendStack from '../../navigators/SendStack';
import LogUtilities from '../../utilities/LogUtilities.js';
import StyleUtilities from '../../utilities/StyleUtilities.js';

class ToAddressForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      copiedText: '',
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.qrCodeData != prevProps.qrCodeData) {
      this.props.saveOutgoingTransactionDataSend({
        toaddress: this.props.qrCodeData,
      });
      this.validateToAddress(this.props.qrCodeData);
    }
  }

  validateToAddress(toAddress) {
    if (Web3.utils.isAddress(toAddress)) {
      LogUtilities.logInfo('address validated!');
      this.props.updateToAddressValidation(true);
      return true;
    } else if (!Web3.utils.isAddress(toAddress)) {
      LogUtilities.logInfo('invalid address');
      this.props.updateToAddressValidation(false);
      return false;
    }
  }

  fetchCopiedText = async () => {
    const copiedText = await Clipboard.getString();
    this.validateToAddress(copiedText);
    this.props.saveOutgoingTransactionDataSend({
      toaddress: copiedText,
    });
  };

  render() {
    return (
      <View>
        <FormHeaderContainer>
          <FormHeader marginBottom="0" marginTop="0">
            {I18n.t('to')}
          </FormHeader>
        </FormHeaderContainer>
        <Form
          borderColor={StyleUtilities.getBorderColor(
            this.props.toAddressValidation,
          )}
          borderWidth={1}
          height="56px"
        >
          <SendTextInputContainer>
            <SendTextInput
              placeholder={I18n.t('send-address')}
              clearButtonMode="while-editing"
              onChangeText={(toAddress) => {
                this.validateToAddress(toAddress);
                this.props.saveOutgoingTransactionDataSend({
                  toaddress: toAddress,
                });
              }}
              value={this.props.outgoingTransactionData.send.toaddress}
            />
            <AddressButtons>
              <PasteContainer onPress={() => this.fetchCopiedText()}>
                <PasteText>PASTE</PasteText>
              </PasteContainer>
              <QRCodeContainer
                onPress={() => {
                  this.props.clearQRCodeData();
                  SendStack.navigationOptions = () => {
                    const tabBarVisible = false;
                    return {
                      tabBarVisible,
                    };
                  };
                  this.props.navigation.navigate('QRCodeScan');
                }}
              >
                <Icon name="qrcode-scan" size={20} color="#5f5f5f" />
              </QRCodeContainer>
            </AddressButtons>
          </SendTextInputContainer>
        </Form>
      </View>
    );
  }
}

const FormHeaderContainer = styled.View`
  align-items: center;
  flex-direction: row;
  margin: 0 auto;
  margin-top: 16px;
  width: 90%;
`;

const SendTextInputContainer = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  height: 100%;
  width: 95%;
`;

const SendTextInput = styled.TextInput`
  font-size: 14;
  height: 56px;
  text-align: left;
  width: 75%;
`;

const AddressButtons = styled.View`
  align-items: center;
  flex-direction: row;
`;

const PasteContainer = styled.TouchableOpacity`
  margin-left: 8;
  margin-right: 8;
`;

const PasteText = styled.Text`
  color: #00a3e2;
  font-family: 'HKGrotesk-Regular';
  font-size: 14;
`;

const QRCodeContainer = styled.TouchableOpacity``;

function mapStateToProps(state) {
  return {
    outgoingTransactionData:
      state.ReducerOutgoingTransactionData.outgoingTransactionData,
    qrCodeData: state.ReducerQRCodeData.qrCodeData,
    toAddressValidation: state.ReducerTxFormValidation.toAddressValidation,
  };
}
const mapDispatchToProps = {
  clearQRCodeData,
  saveOutgoingTransactionDataSend,
  updateToAddressValidation,
};

export default withNavigation(
  connect(mapStateToProps, mapDispatchToProps)(ToAddressForm),
);
