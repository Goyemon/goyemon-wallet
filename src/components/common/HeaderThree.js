'use strict';
import React from 'react';
import styled from 'styled-components/native';

const HeaderThree = props => (
  <HeaderThreeText
    color={props.color}
    marginBottom={props.marginBottom}
    marginLeft={props.marginLeft}
    marginTop={props.marginTop}
  >
    {props.children}
  </HeaderThreeText>
);

const HeaderThreeText = styled.Text`
  color: ${props => props.color};
  font-family: 'HKGrotesk-Bold';
  font-size: 16px;
  margin-bottom: ${props => `${props.marginBottom}px`};
  margin-left: ${props => `${props.marginLeft}px`};
  margin-top: ${props => `${props.marginTop}px`};
  text-transform: uppercase;
`;

export { HeaderThree };
