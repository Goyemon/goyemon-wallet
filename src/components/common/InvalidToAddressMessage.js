'use strict';
import React from 'react';
import { View } from 'react-native';
import { ErrorMessage } from '../common';

const InvalidToAddressMessage = (props) => {
  if (props.toAddressValidation || props.toAddressValidation === undefined) {
    return <View />;
  } else if (!props.toAddressValidation) {
    return <ErrorMessage>invalid address!</ErrorMessage>;
  }
};

export { InvalidToAddressMessage };
