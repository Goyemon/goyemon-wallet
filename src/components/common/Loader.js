'use strict';
import React from 'react';
import { ActivityIndicator } from 'react-native';
import styled from 'styled-components';

const Loader = props => {
  const { loading, ...attributes } = props;

  return <ActivityIndicator animating={loading} size="large" color="#FDC800" />;
};

export { Loader };
