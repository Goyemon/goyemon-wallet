'use strict';
import React from 'react';
import { View } from 'react-native';
import { ErrorMessage } from './ErrorMessage';

interface AmountValidateMessage {
  amountValidation: boolean | undefined;
  isEth: boolean;
}

export const AmountValidateMessage = (props: AmountValidateMessage) =>
  props.amountValidation || props.amountValidation === undefined ? (
    <View />
  ) : (
    <ErrorMessage textAlign="center">
      invalid {props.isEth ? 'eth' : 'token'} amount!
    </ErrorMessage>
  );

interface NetworkFeeValidateMessage {
  networkFeeValidation: boolean | undefined;
}

export const NetworkFeeValidateMessage = (props: NetworkFeeValidateMessage) =>
  props.networkFeeValidation || props.networkFeeValidation === undefined ? (
    <View />
  ) : (
    <ErrorMessage textAlign="center">
      not enough eth for a network fee!
    </ErrorMessage>
  );

interface WeiBalanceValidateMessage {
  weiAmountValidation: boolean | undefined;
}

export const WeiBalanceValidateMessage = (props: WeiBalanceValidateMessage) =>
  props.weiAmountValidation || props.weiAmountValidation === undefined ? (
    <View />
  ) : (
    <ErrorMessage textAlign="center">not enough ether!</ErrorMessage>
  );
