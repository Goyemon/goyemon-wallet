'use strict';
import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components';

const InsufficientEthBalanceMessage = props => {
  if (props.ethAmountValidation || props.ethAmountValidation === undefined) {
    return <View />;
  } else {
    return <ErrorMessage>not enough ether!</ErrorMessage>;
  }
};

const ErrorMessage = styled.Text`
  color: #e41b13;
  font-family: 'HKGrotesk-Regular';
`;

export { InsufficientEthBalanceMessage };
