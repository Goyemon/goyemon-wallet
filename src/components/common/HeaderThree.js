'use strict';
import React from 'react';
import styled from 'styled-components/native';

const HeaderThree = props => (
  <HeaderThreeText
    color={props.color}
    fontSize={props.fontSize}
    marginBottom={props.marginBottom}
    marginLeft={props.marginLeft}
    marginTop={props.marginTop}
  >
    {props.children}
  </HeaderThreeText>
);

const HeaderThreeText = styled.Text`
  color: ${props => props.color};
  font-size: ${props => props.fontSize};
  margin-bottom: ${props => `${props.marginBottom}px`};
  margin-left: ${props => `${props.marginLeft}px`};
  margin-top: ${props => `${props.marginTop}px`};
  text-align: center;
`;

export { HeaderThree };
