'use strict';
import React from 'react';
import { View } from 'react-native';
import { ErrorMessage } from '../common';

const InsufficientDaiBalanceMessage = (props) => {
  if (props.daiAmountValidation || props.daiAmountValidation === undefined) {
    return <View />;
  } else {
    return <ErrorMessage>not enough dai!</ErrorMessage>;
  }
};

export { InsufficientDaiBalanceMessage };
