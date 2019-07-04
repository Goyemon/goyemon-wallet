'use strict';
import React from 'react';
import styled from 'styled-components/native';

const TouchableCardContainer = props => (
  <CardContainer
    onPress={props.onPress}
    alignItems={props.alignItems}
    flexDirection={props.flexDirection}
    height={props.height}
    justifyContent={props.justifyContent}
    textAlign={props.textAlign}
    width={props.width}
  >
    {props.children}
  </CardContainer>
);

const CardContainer = styled.TouchableOpacity`
  alignItems: ${props => props.alignItems};
  background: #fff;
  border-radius: 8px;
  flexDirection: ${props => props.flexDirection};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  height: ${props => props.height};
  justifyContent: ${props => props.justifyContent};
  margin: 8px auto;
  padding: 16px;
  text-align: ${props => props.textAlign};
  width: ${props => props.width};
`;

export { TouchableCardContainer };
