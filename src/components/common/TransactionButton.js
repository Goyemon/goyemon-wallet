'use strict';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styled from 'styled-components';

const TransactionButton = props => (
  <ButtonContainer
    onPress={props.onPress}
    backgroundColor={props.backgroundColor}
    borderColor={props.borderColor}
    margin={props.margin}
    opacity={props.opacity}
    disabled={props.disabled}
  >
    <Icon name={props.iconName} size={20} backgroundColor="red" padding="16px" color={props.iconColor} />
    <ButtonText textColor={props.textColor}>{props.text}</ButtonText>
  </ButtonContainer>
);

const ButtonContainer = styled.TouchableOpacity`
  align-items: center;
  flex-direction: row;
  justify-content: center;
  background-color: ${props => props.backgroundColor};
  border-color: ${props => props.borderColor};
  border-radius: 16px;
  border-width: 1;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin: ${props => props.margin};
  min-width: 120px;
  opacity: ${props => props.opacity};
  width: 45%;
`;

const ButtonText = styled.Text`
  color: ${props => props.textColor};
  font-family: 'HKGrotesk-Bold';
  font-size: 20;
  padding: 12px 24px;
  text-align: center;
`;

export { TransactionButton };
