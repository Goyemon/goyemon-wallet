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
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  font-size: 20;
  margin-bottom: ${props => `${props.marginBottom}`};
  margin-left: ${props => `${props.marginLeft}`};
  margin-top: ${props => `${props.marginTop}`};
  text-align: center;
`;

export { Description };
