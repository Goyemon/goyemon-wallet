'use strict';
import React from 'react';
import styled from 'styled-components';

const UseMaxButton = (props) => (
  <ButtonContainer onPress={props.onPress}>
    <ButtonText textColor={props.textColor}>{props.text}</ButtonText>
  </ButtonContainer>
);

const ButtonContainer = styled.TouchableOpacity`
  align-items: flex-end;
  flex: 1;
`;

const ButtonText = styled.Text`
  color: ${(props) => props.textColor};
  font-family: 'HKGrotesk-Regular';
  font-size: 14;
`;

export { UseMaxButton };
