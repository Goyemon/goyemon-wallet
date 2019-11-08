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
  font-size: 24px;
  font-weight: bold;
  margin-bottom: ${props => `${props.marginBottom}px`};
  margin-left: ${props => `${props.marginLeft}px`};
  margin-top: ${props => `${props.marginTop}px`};
  text-align: center;
`;

export { FormHeader };
