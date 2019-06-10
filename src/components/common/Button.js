'use strict';
import React from 'react';
import styled from 'styled-components';

const Button = props => (
  <ButtonContainer onPress={props.onPress} backgroundColor={props.backgroundColor}>
    <ButtonText textColor={props.textColor}>{props.text}</ButtonText>
  </ButtonContainer>
);

const ButtonContainer = styled.TouchableOpacity`
  width: 160px;
  border-radius: 8px;
  background-color: ${props => props.backgroundColor};
  margin-top: 24px;
`;

const ButtonText = styled.Text`
  font-size: 16px;
  color: ${props => props.textColor};
  padding: 16px;
  text-align: center;
`;

export { Button };
