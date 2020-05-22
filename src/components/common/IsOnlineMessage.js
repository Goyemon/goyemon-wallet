'use strict';
import React from 'react';
import { View } from 'react-native';
import { ErrorMessage } from '../common';

const IsOnlineMessage = (props) => {
  if (props.isOnline) {
    return <View />;
  }
  return <ErrorMessage textAlign="center">you are offline 😟</ErrorMessage>;
};

export { IsOnlineMessage };
