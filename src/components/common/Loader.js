'use strict';
import React from 'react';
import { ActivityIndicator } from 'react-native';
import styled from 'styled-components';

const Loader = props => {
  const { loading, ...attributes } = props;

  return <ActivityIndicator animating={props.animating} size={16} color="#FDC800" />;
};

export { Loader };
