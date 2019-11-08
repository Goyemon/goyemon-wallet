'use strict';
import React from 'react';
import styled from 'styled-components/native';

const Form = props => (
  <CardContainer
    borderColor={props.borderColor}
    borderWidth={props.borderWidth}
    height={props.height}
  >
    {props.children}
  </CardContainer>
);

const CardContainer = styled.View`
  alignItems: center;
  background: #fff;
  border-radius: 0;
  border-color: ${props => props.borderColor};
  border-width: ${props => props.borderWidth};
  flexDirection: column;
  height: ${props => props.height};
  justifyContent: flex-start;
  margin: 16px auto;
  padding: 16px;
  width: 80%;
`;

export { Form };
