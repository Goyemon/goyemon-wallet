'use strict';
import React from 'react';
import { ActivityIndicator } from 'react-native';

const Loader = (props) => {
  return (
    <ActivityIndicator
      animating={props.animating}
      size={props.size}
      color="#FDC800"
    />
  );
};

export { Loader };
