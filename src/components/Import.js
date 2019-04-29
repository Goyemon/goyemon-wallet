'use strict';
import React, { Component } from 'react';
import { Header } from './common';
import styled from 'styled-components/native';

export default class Import extends Component {
  render() {
    return (
      <Container>
        <Title>Choose your wallet</Title>
      </Container>
    );
  }
}

const Container = styled.View`
  flex: 1;
  font-size: 40px;
  justify-content: center;
  align-items: center;
`;

const Title = styled.Text`
  font-size: 40px;
`;
