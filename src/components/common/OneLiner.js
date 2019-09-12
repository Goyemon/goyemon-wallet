'use strict';
import React from 'react';
import styled from 'styled-components/native';

const OneLiner = props => (
  <OneLinerText
    fontSize={props.fontSize}
    fontWeight={props.fontWeight}
    marginBottom={props.marginBottom}
    marginLeft={props.marginLeft}
    marginTop={props.marginTop}
  >
    {props.children}
  </OneLinerText>
);

const OneLinerText = styled.Text`
  color: #5F5F5F;
  font-size: ${props => props.fontSize};
  font-weight: ${props => props.fontWeight};
  margin-bottom: ${props => `${props.marginBottom}px`};
  margin-left: ${props => `${props.marginLeft}px`};
  margin-top: ${props => `${props.marginTop}px`};
  text-align: center;
`;

export { OneLiner };
