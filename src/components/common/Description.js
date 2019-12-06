'use strict';
import React from 'react';
import styled from 'styled-components/native';

const Description = props => (
  <DescriptionText
    marginBottom={props.marginBottom}
    marginLeft={props.marginLeft}
    marginTop={props.marginTop}
  >
    {props.children}
  </DescriptionText>
);

const DescriptionText = styled.Text`
  color: #5F5F5F;
  font-family: 'HKGrotesk-Regular';
  font-size: 20px;
  margin-bottom: ${props => `${props.marginBottom}px`};
  margin-left: ${props => `${props.marginLeft}px`};
  margin-top: ${props => `${props.marginTop}px`};
  text-align: center;
`;

export { Description };
