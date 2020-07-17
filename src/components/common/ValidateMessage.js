'use strict';
import React from 'react';
import { View } from 'react-native';
import { ErrorMessage } from './ErrorMessage';

const ValidateMessage = props => {
    if (props.amountValidation || props.amountValidation === undefined)
      return <View />;
    else
      return <ErrorMessage textAlign="center">invalid {props.isEth ? 'eth' : 'token'} amount!</ErrorMessage>;
}

export { ValidateMessage }
