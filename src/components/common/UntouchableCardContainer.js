'use strict';
import React from 'react';
import styled from 'styled-components/native';

const UntouchableCardContainer = props => (
  <CardContainer
    alignItems={props.alignItems}
    borderRadius={props.borderRadius}
    flexDirection={props.flexDirection}
    height={props.height}
    justifyContent={props.justifyContent}
    marginTop={props.marginTop}
    textAlign={props.textAlign}
    width={props.width}
  >
    {props.children}
  </CardContainer>
);

const CardContainer = styled.View`
  align-items: ${props => props.alignItems};
  background: #fff;
  border-radius: ${props => props.borderRadius};
  flex-direction: ${props => props.flexDirection};
  height: ${props => props.height};
  justify-content: ${props => props.justifyContent};
  margin: 16px auto;
  margin-top: ${props => props.marginTop};
  padding: 16px;
  text-align: ${props => props.textAlign};
  width: ${props => props.width};
`;

export { UntouchableCardContainer };
