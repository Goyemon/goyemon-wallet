'use strict';
import React from 'react';
import styled from 'styled-components';
import I18n from '../../i18n/I18n';

const TxConfirmationButton = (props) => (
  <ButtonContainer disabled={props.disabled} onPress={props.onPress}>
    <ButtonText>{props.text}</ButtonText>
  </ButtonContainer>
);

const ButtonContainer = styled.TouchableOpacity`
  background-color: #00a3e2;
  border-color: #00a3e2;
  border-radius: 16px;
  border-width: 1;
  margin-bottom: 24px;
  min-width: 120px;
`;

let ButtonText;
if (I18n.locale === 'ja-US') {
  ButtonText = styled.Text`
    color: #fff;
    font-family: 'HKGrotesk-Bold';
    font-size: 18;
    padding: 14px 24px 8px 24px;
    text-align: center;
  `;
} else {
  ButtonText = styled.Text`
    color: #fff;
    font-family: 'HKGrotesk-Bold';
    font-size: 20;
    padding: 12px 24px;
    text-align: center;
  `;
}

export { TxConfirmationButton };
