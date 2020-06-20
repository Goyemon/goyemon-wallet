'use strict';
import React from 'react';
import styled from 'styled-components/native';

const Form = (props) => (
  <FormCardContainer
    borderColor={props.borderColor}
    borderWidth={props.borderWidth}
    height={props.height}
  >
    {props.children}
  </FormCardContainer>
);

const FormCardContainer = styled.View`
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

const SwapForm = (props) => (
  <SwapFormCardContainer
    borderBottomColor={props.borderBottomColor}
    borderBottomWidth={props.borderBottomWidth}
    height={props.height}
  >
    {props.children}
  </SwapFormCardContainer>
);

const SwapFormCardContainer = styled.View`
  background: #fff;
  border-radius: 0;
  border-bottom-color: ${(props) => props.borderBottomColor};
  border-bottom-width: ${(props) => props.borderBottomWidth};
  width: 80%;
`;

export { Form, SwapForm };
