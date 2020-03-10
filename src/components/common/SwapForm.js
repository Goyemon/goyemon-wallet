'use strict';
import React from 'react';
import styled from 'styled-components/native';

const SwapForm = props => (
  <CardContainer
    borderBottomColor={props.borderBottomColor}
    borderBottomWidth={props.borderBottomWidth}
    height={props.height}
  >
    {props.children}
  </CardContainer>
);

const CardContainer = styled.View`
  background: #fff;
  border-radius: 0;
  border-bottom-color: ${props => props.borderBottomColor};
  border-bottom-width: ${props => props.borderBottomWidth};
  width: 80%;
`;

export { SwapForm };
