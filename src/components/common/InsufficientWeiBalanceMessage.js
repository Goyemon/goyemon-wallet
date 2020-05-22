'use strict';
import React from 'react';
import { View } from 'react-native';
import { ErrorMessage } from '.';

const InsufficientWeiBalanceMessage = (props) => {
  if (props.weiAmountValidation || props.weiAmountValidation === undefined) {
    return <View />;
  } else if (!props.weiAmountValidation) {
    return <ErrorMessage textAlign="center">not enough ether!</ErrorMessage>;
  }
};

export { InsufficientWeiBalanceMessage };
