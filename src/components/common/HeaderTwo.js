'use strict';
import React from 'react';
import styled from 'styled-components/native';

const HeaderTwo = props => (
  <HeaderTwoText
    fontSize={props.fontSize}
    marginBottom={props.marginBottom}
    marginTop={props.marginTop}
  >
    {props.children}
  </HeaderTwoText>
);

const HeaderTwoText = styled.Text`
  font-size: ${props => props.fontSize};
  font-weight: bold;
  margin-bottom: ${props => `${props.marginBottom}px`};
  margin-top: ${props => `${props.marginTop}px`};
  text-transform: uppercase;
`;

export { HeaderTwo };
