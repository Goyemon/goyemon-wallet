'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  NavigationActions,
  StackActions,
  withNavigation
} from 'react-navigation';
import { View } from 'react-native';
import Modal from 'react-native-modal';
import styled from 'styled-components';
import {
  saveTxConfirmationModalVisibility,
  updateTxConfirmationModalVisibleType
} from '../../actions/ActionModal';
import {
  HeaderFive,
  ConfirmationText,
  IsOnlineMessage,
  Loader,
  HeaderTwo,
  TxConfirmationButton,
  ModalHandler
} from '../../components/common';
import NetworkFeeContainerConfirmation from './NetworkFeeContainerConfirmation';
import I18n from '../../i18n/I18n';
import LogUtilities from '../../utilities/LogUtilities.js';
import TransactionUtilities from '../../utilities/TransactionUtilities.ts';

class TxConfirmationModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      buttonDisabled: false
    };
  }

  resetNavigation = (routeName) => {
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName })],
      key: null
    });
    this.props.navigation.dispatch(resetAction);
  };

  returnHeaderType() {
    if (
      this.props.modal.txConfirmationModalType === 'compound-deposit' ||
      this.props.modal.txConfirmationModalType === 'pool-together-deposit' ||
      this.props.modal.txConfirmationModalType === 'compound-approve' ||
      this.props.modal.txConfirmationModalType === 'pool-together-approve'
    ) {
      return <HeaderFive width="80%">{I18n.t('deposit-amount')}</HeaderFive>;
    } else if (
      this.props.modal.txConfirmationModalType === 'compound-withdraw' ||
      this.props.modal.txConfirmationModalType === 'pool-together-withdraw'
    ) {
      return <HeaderFive width="80%">{I18n.t('withdraw-amount')}</HeaderFive>;
    }
  }

  returnCurrency() {
    if (this.props.modal.txConfirmationModalType === 'send-eth') {
      return 'ETH';
    } else if (this.props.modal.txConfirmationModalType === 'send-dai') {
      return 'DAI';
    }
  }

  returnButtonType() {
    if (
      this.props.modal.txConfirmationModalType === 'compound-deposit' ||
      this.props.modal.txConfirmationModalType === 'pool-together-deposit' ||
      this.props.modal.txConfirmationModalType === 'compound-approve' ||
      this.props.modal.txConfirmationModalType === 'pool-together-approve'
    ) {
      return I18n.t('deposit');
    } else if (
      this.props.modal.txConfirmationModalType === 'compound-withdraw' ||
      this.props.modal.txConfirmationModalType === 'pool-together-withdraw'
    ) {
      return I18n.t('withdraw');
    }
  }

  renderModalContent() {
    const { modal, outgoingTransactionData, isOnline, navigation } = this.props;

    if (
      modal.txConfirmationModalType === 'send-eth' ||
      modal.txConfirmationModalType === 'send-dai'
    ) {
      return (
        <View>
          <ConfirmationContainer>
            <HeaderFive width="80%">{I18n.t('to')}</HeaderFive>
            <ConfirmationText>
              {outgoingTransactionData.send.toaddress}
            </ConfirmationText>
            <HeaderFive width="80%">{I18n.t('amount')}</HeaderFive>
            <ConfirmationText>
              {outgoingTransactionData.send.amount} {this.returnCurrency()}
            </ConfirmationText>
            <NetworkFeeContainerConfirmation
              gasLimit={outgoingTransactionData.send.gasLimit}
            />
          </ConfirmationContainer>
          <ButtonContainer>
            <TxConfirmationButton
              text={I18n.t('button-send')}
              disabled={this.state.buttonDisabled}
              onPress={async () => {
                if (isOnline) {
                  this.setState({ loading: true, buttonDisabled: true });
                  await TransactionUtilities.sendOutgoingTransactionToServer(
                    outgoingTransactionData.send.transactionObject
                  );
                  this.resetNavigation('Send');
                  navigation.navigate('History');
                  this.setState({ loading: false, buttonDisabled: false });
                  this.props.saveTxConfirmationModalVisibility(false);
                  this.props.updateTxConfirmationModalVisibleType(null);
                }
              }}
            />
          </ButtonContainer>
          <Loader animating={this.state.loading} size="small" />
          <IsOnlineMessage isOnline={isOnline} />
        </View>
      );
    } else if (modal.txConfirmationModalType === 'compound-approve') {
      return (
        <View>
          <ConfirmationContainer>
            {this.returnHeaderType()}
            <ConfirmationText>
              {outgoingTransactionData.compound.amount} DAI
            </ConfirmationText>
            <NetworkFeeContainerConfirmation
              gasLimit={outgoingTransactionData.compound.gasLimit}
            />
          </ConfirmationContainer>
          <ButtonContainer>
            <TxConfirmationButton
              text={this.returnButtonType()}
              disabled={this.state.buttonDisabled}
              onPress={async () => {
                if (isOnline) {
                  this.setState({ loading: true, buttonDisabled: true });
                  await TransactionUtilities.sendOutgoingTransactionToServer(
                    outgoingTransactionData.compound.approveTransactionObject
                  );
                  await TransactionUtilities.sendOutgoingTransactionToServer(
                    outgoingTransactionData.compound.transactionObject
                  );
                  this.resetNavigation('EarnHome');
                  navigation.navigate('History');
                  this.setState({ loading: false, buttonDisabled: false });
                  this.props.saveTxConfirmationModalVisibility(false);
                  this.props.updateTxConfirmationModalVisibleType(null);
                }
              }}
            />
          </ButtonContainer>
          <Loader animating={this.state.loading} size="small" />
          <IsOnlineMessage isOnline={isOnline} />
        </View>
      );
    } else if (
      modal.txConfirmationModalType === 'compound-deposit' ||
      modal.txConfirmationModalType === 'compound-withdraw'
    ) {
      return (
        <View>
          <ConfirmationContainer>
            {this.returnHeaderType()}
            <ConfirmationText>
              {outgoingTransactionData.compound.amount} DAI
            </ConfirmationText>
            <NetworkFeeContainerConfirmation
              gasLimit={outgoingTransactionData.compound.gasLimit}
            />
          </ConfirmationContainer>
          <ButtonContainer>
            <TxConfirmationButton
              text={this.returnButtonType()}
              disabled={this.state.buttonDisabled}
              onPress={async () => {
                if (isOnline) {
                  this.setState({ loading: true, buttonDisabled: true });
                  await TransactionUtilities.sendOutgoingTransactionToServer(
                    outgoingTransactionData.compound.transactionObject
                  );
                  this.resetNavigation('EarnHome');
                  navigation.navigate('History');
                  this.setState({ loading: false, buttonDisabled: false });
                  this.props.saveTxConfirmationModalVisibility(false);
                  this.props.updateTxConfirmationModalVisibleType(null);
                }
              }}
            />
          </ButtonContainer>
          <Loader animating={this.state.loading} size="small" />
          <IsOnlineMessage isOnline={isOnline} />
        </View>
      );
    } else if (modal.txConfirmationModalType === 'pool-together-approve') {
      return (
        <View>
          <ConfirmationContainer>
            {this.returnHeaderType()}
            <ConfirmationText>
              {outgoingTransactionData.poolTogether.amount} DAI
            </ConfirmationText>
            <NetworkFeeContainerConfirmation
              gasLimit={outgoingTransactionData.poolTogether.gasLimit}
            />
          </ConfirmationContainer>
          <ButtonContainer>
            <TxConfirmationButton
              text={this.returnButtonType()}
              disabled={this.state.buttonDisabled}
              onPress={async () => {
                if (isOnline) {
                  this.setState({ loading: true, buttonDisabled: true });
                  await TransactionUtilities.sendOutgoingTransactionToServer(
                    outgoingTransactionData.poolTogether
                      .approveTransactionObject
                  );
                  await TransactionUtilities.sendOutgoingTransactionToServer(
                    outgoingTransactionData.poolTogether.transactionObject
                  );
                  this.resetNavigation('EarnHome');
                  navigation.navigate('History');
                  this.setState({ loading: false, buttonDisabled: false });
                  this.props.saveTxConfirmationModalVisibility(false);
                  this.props.updateTxConfirmationModalVisibleType(null);
                }
              }}
            />
          </ButtonContainer>
          <Loader animating={this.state.loading} size="small" />
          <IsOnlineMessage isOnline={isOnline} />
        </View>
      );
    } else if (
      modal.txConfirmationModalType === 'pool-together-deposit' ||
      modal.txConfirmationModalType === 'pool-together-withdraw'
    ) {
      return (
        <View>
          <ConfirmationContainer>
            {this.returnHeaderType()}
            <ConfirmationText>
              {outgoingTransactionData.poolTogether.amount} DAI
            </ConfirmationText>
            <NetworkFeeContainerConfirmation
              gasLimit={outgoingTransactionData.poolTogether.gasLimit}
            />
          </ConfirmationContainer>
          <ButtonContainer>
            <TxConfirmationButton
              text={this.returnButtonType()}
              disabled={this.state.buttonDisabled}
              onPress={async () => {
                if (isOnline) {
                  this.setState({ loading: true, buttonDisabled: true });
                  await TransactionUtilities.sendOutgoingTransactionToServer(
                    outgoingTransactionData.poolTogether.transactionObject
                  );
                  this.resetNavigation('EarnHome');
                  navigation.navigate('History');
                  this.setState({ loading: false, buttonDisabled: false });
                  this.props.saveTxConfirmationModalVisibility(false);
                  this.props.updateTxConfirmationModalVisibleType(null);
                }
              }}
            />
          </ButtonContainer>
          <Loader animating={this.state.loading} size="small" />
          <IsOnlineMessage isOnline={isOnline} />
        </View>
      );
    } else if (modal.txConfirmationModalType === 'swap') {
      return (
        <View>
          <ConfirmationContainer>
            <HeaderFive width="80%">You Pay</HeaderFive>
            <ConfirmationText>
              {outgoingTransactionData.swap.sold} ETH
            </ConfirmationText>
            <HeaderFive width="80%">You Get at Least</HeaderFive>
            <ConfirmationText>
              {outgoingTransactionData.swap.minBought.toFixed(4)} DAI
              <SlippageText>
                {' '}
                *slippage {outgoingTransactionData.swap.slippage} %
              </SlippageText>
            </ConfirmationText>
            <NetworkFeeContainerConfirmation
              gasLimit={outgoingTransactionData.swap.gasLimit}
            />
          </ConfirmationContainer>
          <ButtonContainer>
            <TxConfirmationButton
              text={I18n.t('button-swap')}
              disabled={this.state.buttonDisabled}
              onPress={async () => {
                if (isOnline) {
                  this.setState({ loading: true, buttonDisabled: true });
                  await TransactionUtilities.sendOutgoingTransactionToServer(
                    outgoingTransactionData.swap.transactionObject
                  );
                  this.resetNavigation('Swap');
                  navigation.navigate('History');
                  this.setState({ loading: false, buttonDisabled: false });
                  this.props.saveTxConfirmationModalVisibility(false);
                  this.props.updateTxConfirmationModalVisibleType(null);
                }
              }}
            />
          </ButtonContainer>
          <Loader animating={this.state.loading} size="small" />
          <IsOnlineMessage isOnline={isOnline} />
        </View>
      );
    } else {
      LogUtilities.logInfo('no type matches ');
    }
  }

  render() {
    return (
      <Modal
        animationIn="slideInUp"
        animationOut="slideOutDown"
        isVisible={this.props.modal.txConfirmationModalVisibility}
        swipeDirection="down"
        onBackdropPress={() => {
          this.props.saveTxConfirmationModalVisibility(false);
          this.props.updateTxConfirmationModalVisibleType(null);
        }}
        onSwipeComplete={() => {
          this.props.saveTxConfirmationModalVisibility(false);
          this.props.updateTxConfirmationModalVisibleType(null);
        }}
        style={{
          marginLeft: 4,
          marginRight: 4,
          marginBottom: 0,
          flexDirection: 'row',
          alignItems: 'flex-end'
        }}
      >
        <ModalContainer>
          <ModalHandler />
          <HeaderContainer>
            <HeaderTwo marginBottom="0" marginLeft="0" marginTop="16">
              Confirm Transaction
            </HeaderTwo>
          </HeaderContainer>
          <ModalInner>{this.renderModalContent()}</ModalInner>
        </ModalContainer>
      </Modal>
    );
  }
}

const ConfirmationContainer = styled.View`
  padding: 8px 24px;
`;

const ModalContainer = styled.View`
  background-color: #fff;
  border-radius: 16px;
  width: 100%;
`;

const HeaderContainer = styled.View`
  align-items: center;
`;

const ModalInner = styled.View`
  align-items: center;
  justify-content: center;
  margin-top: 16;
  flex-direction: column;
`;

const SlippageText = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  font-size: 16;
`;

const ButtonContainer = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: center;
`;

function mapStateToProps(state) {
  return {
    isOnline: state.ReducerNetInfo.isOnline,
    outgoingTransactionData:
      state.ReducerOutgoingTransactionData.outgoingTransactionData,
    modal: state.ReducerModal.modal
  };
}

const mapDispatchToProps = {
  saveTxConfirmationModalVisibility,
  updateTxConfirmationModalVisibleType
};

export default withNavigation(
  connect(mapStateToProps, mapDispatchToProps)(TxConfirmationModal)
);
