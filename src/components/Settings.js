'use strict';
import React, { Component } from 'react';
import { Text, Image } from 'react-native';
import { RootContainer, HeaderOne } from '../components/common';

export default class Settings extends Component {
  render() {
    return (
      <RootContainer>
        <HeaderOne  marginTop="96">Settings</HeaderOne>
      </RootContainer>
    );
  }
}
