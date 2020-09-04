"use strict";
import React from "react";
import { View } from "react-native";
import { ErrorMessage } from "./ErrorMessage";

const AmountValidateMessage = (props) => {
  if (props.amountValidation || props.amountValidation === undefined)
    return <View />;
  else
    return (
      <ErrorMessage textAlign="center">
        invalid {props.isEth ? "eth" : "token"} amount!
      </ErrorMessage>
    );
};

const NetworkFeeValidateMessage = (props) => {
  if (props.networkFeeValidation || props.networkFeeValidation === undefined)
    return <View />;
  else
    return (
      <ErrorMessage textAlign="center">
        not enough eth for a network fee!
      </ErrorMessage>
    );
};

const WeiBalanceValidateMessage = (props) => {
  if (props.weiAmountValidation || props.weiAmountValidation === undefined) {
    return <View />;
  } else if (!props.weiAmountValidation) {
    return <ErrorMessage textAlign="center">not enough ether!</ErrorMessage>;
  }
};

export {
  AmountValidateMessage,
  NetworkFeeValidateMessage,
  WeiBalanceValidateMessage
};
