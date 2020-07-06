'use strict';
import React from 'react';
import { View } from 'react-native';
import { ErrorMessage } from './ErrorMessage';

const ValidateMessage = props => {
    if (props.amountValidation || props.amountValidation === undefined)
        return props.numberValidation
        ? <View />
        : <ErrorMessage textAlign="center">number is invalid!</ErrorMessage>
  else
    return <ErrorMessage textAlign="center">not enough {props.isEth ? 'ether' : 'token'}!</ErrorMessage>;
}

export { ValidateMessage }
