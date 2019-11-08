'use strict';
import React from 'react';
import styled from 'styled-components';

const Button = props => (
  <ButtonContainer
    onPress={props.onPress}
    backgroundColor={props.backgroundColor}
    borderColor={props.borderColor}
    margin={props.margin}
    opacity={props.opacity}
    disabled={props.disabled}
  >
    <ButtonText textColor={props.textColor}>{props.text}</ButtonText>
  </ButtonContainer>
);

const ButtonContainer = styled.TouchableOpacity`
  background-color: ${props => props.backgroundColor};
  border-color: ${props => props.borderColor};
  border-radius: 16px;
  border-width: 1;
  margin: ${props => props.margin};
  min-width: 160px;
  opacity: ${props => props.opacity};
`;

const ButtonText = styled.Text`
  color: ${props => props.textColor};
  font-size: 20px;
  padding: 16px 32px;
  text-align: center;
`;

export { Button };
