'use strict';
import React from 'react';
import styled from 'styled-components/native';

const HeaderThree = props => (
  <HeaderThreeText
    marginBottom={props.marginBottom}
    marginLeft={props.marginLeft}
    marginTop={props.marginTop}
  >
    {props.children}
  </HeaderThreeText>
);

const HeaderThreeText = styled.Text`
  color: #000;
  font-family: 'HKGrotesk-Bold';
  font-size: 16px;
  margin-bottom: ${props => `${props.marginBottom}px`};
  margin-left: ${props => `${props.marginLeft}px`};
  margin-top: ${props => `${props.marginTop}px`};
  text-transform: uppercase;
`;

export { HeaderThree };
