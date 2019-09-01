'use strict';
import React from 'react';
import styled from 'styled-components/native';

const HeaderTwo = props => (
  <HeaderTwoText
    color={props.color}
    fontSize={props.fontSize}
    marginBottom={props.marginBottom}
    marginLeft={props.marginLeft}
    marginTop={props.marginTop}
  >
    {props.children}
  </HeaderTwoText>
);

const HeaderTwoText = styled.Text`
  color: ${props => props.color};
  font-size: ${props => props.fontSize};
  font-weight: bold;
  margin-bottom: ${props => `${props.marginBottom}px`};
  margin-left: ${props => `${props.marginLeft}px`};
  margin-top: ${props => `${props.marginTop}px`};
  text-transform: uppercase;
`;

export { HeaderTwo };
