'use strict';
import React from 'react';
import styled from 'styled-components/native';

const HeaderFour = props => (
  <HeaderFourText
    marginTop={props.marginTop}
  >
    {props.children}
  </HeaderFourText>
);

const HeaderFourText = styled.Text`
  color: #5F5F5F;
  font-family: 'HKGrotesk-Regular';
  font-size: 20;
  margin-bottom: 16;
  margin-top: ${props => `${props.marginTop}`};
  text-transform: uppercase;
`;

export { HeaderFour };
