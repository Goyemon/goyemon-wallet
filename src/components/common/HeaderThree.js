'use strict';
import React from 'react';
import styled from 'styled-components/native';

const HeaderThree = (props) => (
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
  color: ${(props) => props.color};
  font-family: 'HKGrotesk-Bold';
  font-size: 16;
  margin-bottom: ${(props) => `${props.marginBottom}`};
  margin-left: ${(props) => `${props.marginLeft}`};
  margin-top: ${(props) => `${props.marginTop}`};
  text-transform: uppercase;
`;

export { HeaderThree };
