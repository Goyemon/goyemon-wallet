'use strict';
import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components';

const InvalidToAddressMessage = props => {
  if (
    props.toAddressValidation ||
    props.toAddressValidation === undefined
  ) {
    return <View />;
  } else if (!props.toAddressValidation) {
    return <ErrorMessage>invalid address!</ErrorMessage>;
  }
};

const ErrorMessage = styled.Text`
  color: #e41b13;
  font-family: 'HKGrotesk-Regular';
`;

export { InvalidToAddressMessage };
