"use strict";
import React from "react";
import { View } from "react-native";
import { ErrorMessage } from "./ErrorMessage";

interface AmountValidateMessageProps {
  amountValidation: boolean | undefined;
  isEth: boolean;
}

export const AmountValidateMessage = (props: AmountValidateMessageProps) =>
  props.amountValidation || props.amountValidation === undefined ? (
    <ErrorMessage textAlign="center">&nbsp;&nbsp;</ErrorMessage>
  ) : (
    <ErrorMessage textAlign="center">
      invalid {props.isEth ? "eth" : "token"} amount!
    </ErrorMessage>
  );

interface NetworkFeeValidateMessageProps {
  networkFeeValidation: boolean | undefined;
}

export const NetworkFeeValidateMessage = (
  props: NetworkFeeValidateMessageProps
) =>
  props.networkFeeValidation || props.networkFeeValidation === undefined ? (
    <View />
  ) : (
    <ErrorMessage textAlign="center">
      not enough eth for a network fee!
    </ErrorMessage>
  );

interface WeiBalanceValidateMessageProps {
  weiAmountValidation: boolean | undefined;
}

export const WeiBalanceValidateMessage = (
  props: WeiBalanceValidateMessageProps
) =>
  props.weiAmountValidation || props.weiAmountValidation === undefined ? (
    <View />
  ) : (
    <ErrorMessage textAlign="center">not enough ether!</ErrorMessage>
  );
