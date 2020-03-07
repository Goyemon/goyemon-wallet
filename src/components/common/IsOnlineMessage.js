'use strict';
import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components';

const IsOnlineMessage = props => {
    if (props.netInfo) {
        return <View />;
      }
      return <ErrorMessage>you are offline 😟</ErrorMessage>;
};

const ErrorMessage = styled.Text`
  color: #e41b13;
  font-family: 'HKGrotesk-Regular';
`;

export { IsOnlineMessage };
