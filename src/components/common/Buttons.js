'use strict';
import React from 'react';
import styled from 'styled-components';
import I18n from '../../i18n/I18n';

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

let ButtonText;
// if (I18n.locale === 'ja-US') {
//   ButtonText = styled.Text`
//     color: ${(props) => props.textColor};
//     font-family: 'HKGrotesk-Bold';
//     font-size: 18;
//     padding: 14px 24px 8px 24px;
//     text-align: center;
//   `;
// } else {

ButtonText = styled.Text`
  color: ${(props) => props.textColor};
  font-family: 'HKGrotesk-Bold';
  font-size: 20;
  padding: 12px 24px;
  text-align: center;
`;
// }

const TxConfirmationButton = (props) => (
  <TxConfirmationButtonContainer
    disabled={props.disabled}
    onPress={props.onPress}
  >
    <TxConfirmationButtonText>{props.text}</TxConfirmationButtonText>
  </TxConfirmationButtonContainer>
);

const TxConfirmationButtonContainer = styled.TouchableOpacity`
  background-color: #00a3e2;
  border-color: #00a3e2;
  border-radius: 16px;
  border-width: 1;
  margin-bottom: 24px;
  min-width: 120px;
`;

const TxConfirmationButtonText = styled.Text`
  color: #fff;
  font-family: 'HKGrotesk-Bold';
  font-size: ${I18n.locale == 'ja-US' ? 18 : 20};
  padding: ${I18n.locale == 'ja-US' ? '14px 24px 8px 24px' : '12px 24px'};
  text-align: center;
`;

const TxNextButton = (props) => (
  <TxNextButtonContainer
    disabled={props.disabled}
    opacity={props.opacity}
    onPress={props.onPress}
  >
    <TxNextButtonText>{I18n.t('button-next')}</TxNextButtonText>
  </TxNextButtonContainer>
);

const TxNextButtonContainer = styled.TouchableOpacity`
  background-color: #fff;
  border-color: #00a3e2;
  border-radius: 16px;
  border-width: 1;
  margin: 40px auto;
  margin-bottom: 12px;
  min-width: 120px;
  opacity: ${(props) => props.opacity};
`;

let TxNextButtonText;
// if (I18n.locale === 'ja-US') {
//   TxNextButtonText = styled.Text`
//     color: #00a3e2;
//     font-family: 'HKGrotesk-Bold';
//     font-size: 18;
//     padding: 14px 24px 8px 24px;
//     text-align: center;
//   `;
// } else {
TxNextButtonText = styled.Text`
  color: #00a3e2;
  font-family: 'HKGrotesk-Bold';
  font-size: 20;
  padding: 12px 24px;
  text-align: center;
`;
// }

const UseMaxButton = (props) => (
  <UseMaxButtonContainer onPress={props.onPress}>
    <UseMaxButtonText textColor={props.textColor}>
      {props.text}
    </UseMaxButtonText>
  </UseMaxButtonContainer>
);

const UseMaxButtonContainer = styled.TouchableOpacity`
  align-items: flex-end;
`;

const UseMaxButtonText = styled.Text`
  color: ${(props) => props.textColor};
  font-family: 'HKGrotesk-Regular';
  font-size: 14;
`;

export { Button, TxConfirmationButton, TxNextButton, UseMaxButton };
