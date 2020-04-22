'use strict';
import React from 'react';
import styled from 'styled-components/native';

const ConfirmationText = (props) => <Text>{props.children}</Text>;

const Text = styled.Text`
  color: #000;
  font-family: 'HKGrotesk-Bold';
  font-size: 18;
  margin-bottom: 20;
`;

export { ConfirmationText };
