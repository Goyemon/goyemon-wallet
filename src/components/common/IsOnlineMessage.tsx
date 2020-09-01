'use strict';
import React from 'react';
import { View } from 'react-native';
import { ErrorMessage } from '.';

interface AppProps {
  isOnline: boolean;
}

export const IsOnlineMessage = (props: AppProps) =>
  props.isOnline
  ? <View />
  : <ErrorMessage textAlign="center">you are offline 😟</ErrorMessage>
