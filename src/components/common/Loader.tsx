'use strict';
import React from 'react';
import { ActivityIndicator } from 'react-native';

interface LoaderProps {
  animating: any;
  size: any;
}

export const Loader = (props: LoaderProps) => {
  return (
    <ActivityIndicator
      animating={props.animating}
      size={props.size}
      color="#FDC800"
    />
  );
};
