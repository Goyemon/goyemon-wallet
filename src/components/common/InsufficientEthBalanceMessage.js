'use strict';
import React from 'react';
import { View } from 'react-native';
import { ErrorMessage } from '../common';

const InsufficientEthBalanceMessage = (props) => {
  if (props.ethAmountValidation || props.ethAmountValidation === undefined) {
    return <View />;
  } else {
    return <ErrorMessage>not enough ether!</ErrorMessage>;
  }
};

export { InsufficientEthBalanceMessage };
