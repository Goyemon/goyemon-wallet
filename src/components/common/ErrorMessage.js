'use strict';
import React from 'react';
import styled from 'styled-components/native';

const ErrorMessage = (props) => (
  <ErrorMessageText>{props.children}</ErrorMessageText>
);

const ErrorMessageText = styled.Text`
  color: #e41b13;
  font-family: 'HKGrotesk-Regular';
  text-align: center;
  width: 100%;
`;

export { ErrorMessage };
