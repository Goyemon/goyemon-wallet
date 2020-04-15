'use strict';
import React from 'react';
import styled from 'styled-components';

const Button = (props) => (
  <ButtonContainer
    onPress={props.onPress}
    backgroundColor={props.backgroundColor}
    borderColor={props.borderColor}
    disabled={props.disabled}
    margin={props.margin}
    marginBottom={props.marginBottom}
    opacity={props.opacity}
  >
    <ButtonText textColor={props.textColor}>{props.text}</ButtonText>
  </ButtonContainer>
);

const ButtonContainer = styled.TouchableOpacity`
  background-color: ${(props) => props.backgroundColor};
  border-color: ${(props) => props.borderColor};
  border-radius: 16px;
  border-width: 1;
  margin: ${(props) => props.margin};
  margin-bottom: ${(props) => props.marginBottom};
  min-width: 120px;
  opacity: ${(props) => props.opacity};
`;

const ButtonText = styled.Text`
  color: ${(props) => props.textColor};
  font-family: 'HKGrotesk-Bold';
  font-size: 20;
  padding: 12px 24px;
  text-align: center;
`;

export { Button };
