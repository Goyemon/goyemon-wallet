'use strict';
import React from 'react';
import { View } from 'react-native';
import { ErrorMessage } from '../common';

const IsOnlineMessage = props => {
    if (props.netInfo) {
        return <View />;
      }
      return <ErrorMessage>you are offline 😟</ErrorMessage>;
};

export { IsOnlineMessage };
