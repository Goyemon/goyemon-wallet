'use strict';
import React from 'react';
import styled from 'styled-components/native';

const FormHeader = props => (
  <FormHeaderText
    marginBottom={props.marginBottom}
    marginLeft={props.marginLeft}
    marginTop={props.marginTop}
  >
    {props.children}
  </FormHeaderText>
);

const FormHeaderText = styled.Text`
  color: #000;
  font-family: 'HKGrotesk-Bold';
  font-size: 20;
  margin-bottom: ${props => `${props.marginBottom}`};
  margin-left: ${props => `${props.marginLeft}`};
  margin-top: ${props => `${props.marginTop}`};
  text-align: center;
`;

export { FormHeader };
