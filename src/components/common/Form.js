'use strict';
import React from 'react';
import styled from 'styled-components/native';

const Form = (props) => (
  <CardContainer
    borderColor={props.borderColor}
    borderWidth={props.borderWidth}
    height={props.height}
  >
    {props.children}
  </CardContainer>
);

const CardContainer = styled.View`
  align-items: center;
  background: #fff;
  border-radius: 8px;
  border-color: ${(props) => props.borderColor};
  border-width: ${(props) => props.borderWidth};
  flex-direction: column;
  height: ${(props) => props.height};
  justify-content: flex-start;
  margin: 16px auto;
  padding: 16px;
  width: 90%;
`;

export { Form };
