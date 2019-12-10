'use strict';
import React from 'react';
import styled from 'styled-components';
import { ActivityIndicator } from 'react-native';

const Loader = props => {
  const { loading, ...attributes } = props;

  return (
    <ActivityIndicator animating={loading} size="large" color="#FDC800" />
  );
};

export { Loader };
