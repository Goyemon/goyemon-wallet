'use strict';
import React from 'react';
import styled from 'styled-components/native';

const FormHeader = props => (
  <FormHeaderContainer>
    <FormHeaderText
      marginBottom={props.marginBottom}
      marginTop={props.marginTop}
    >
      {props.children}
    </FormHeaderText>
  </FormHeaderContainer>
);

const FormHeaderContainer = styled.View`
  flex-direction: row;
  width: 80%;
`;

const FormHeaderText = styled.Text`
  color: #000;
  font-family: 'HKGrotesk-Bold';
  font-size: 20;
  margin-bottom: ${props => `${props.marginBottom}`};
  margin-top: ${props => `${props.marginTop}`};
`;

export { FormHeader };
