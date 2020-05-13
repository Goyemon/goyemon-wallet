'use strict';
import React from 'react';
import styled from 'styled-components';
import I18n from '../../i18n/I18n';

const TxNextButton = (props) => (
  <ButtonContainer
    disabled={props.disabled}
    opacity={props.opacity}
    onPress={props.onPress}
  >
    <ButtonText>{I18n.t('button-next')}</ButtonText>
  </ButtonContainer>
);

const ButtonContainer = styled.TouchableOpacity`
  background-color: #fff;
  border-color: #00a3e2;
  border-radius: 16px;
  border-width: 1;
  margin: 40px auto;
  margin-bottom: 12px;
  min-width: 120px;
  opacity: ${(props) => props.opacity};
`;

let ButtonText;
// if (I18n.locale === 'ja-US') {
//   ButtonText = styled.Text`
//     color: #00a3e2;
//     font-family: 'HKGrotesk-Bold';
//     font-size: 18;
//     padding: 14px 24px 8px 24px;
//     text-align: center;
//   `;
// } else {
  ButtonText = styled.Text`
    color: #00a3e2;
    font-family: 'HKGrotesk-Bold';
    font-size: 20;
    padding: 12px 24px;
    text-align: center;
  `;
// }

export { TxNextButton };
