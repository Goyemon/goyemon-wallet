'use strict';
import React from 'react';
import styled from 'styled-components/native';

interface AppProps {
  textAlign: string;
  children: any;
}

export const ErrorMessage = (props: AppProps) => (
  <ErrorMessageText textAlign={props.textAlign}>
    {props.children}
  </ErrorMessageText>
);

const ErrorMessageText = styled.Text`
  color: #e41b13;
  font-family: 'HKGrotesk-Regular';
  text-align: ${(props: AppProps) => props.textAlign};
  width: 100%;
`;
