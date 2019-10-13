'use strict';
import React from 'react';
import { Text } from 'react-native';
import styled from 'styled-components';

const ProgressBar = props => (
  <Container>
    <Text>{props.text} of 3 steps</Text>
    <Outer>
      <Inner width={props.width} />
    </Outer>
  </Container>
);

const Container = styled.View`
  alignItems: center;
  margin-top: 96px;
`;

const Outer = styled.View`
  background-color: #eeeeee;
  border-radius: 16px;
  height: 16px;
  margin-top: 16px;
  width: 80%;
`;

const Inner = styled.View`
  background-color: #ffbf00;
  border-radius: 16px;
  height: 16px;
  width: ${props => props.width};
`;

export { ProgressBar };
