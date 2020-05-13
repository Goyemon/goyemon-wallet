'use strict';
import React from 'react';
import { TouchableHighlight } from 'react-native';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import I18n from '../../i18n/I18n';

const SettingsListCard = (props) => (
  <TouchableHighlight onPress={props.onPress} underlayColor="#FFF">
    <SettingsList>
      <Icon name={props.iconName} color="#5F5F5F" size={28} />
      <SettingsListText>{props.children}</SettingsListText>
      <Icon name="chevron-right" color="#5F5F5F" size={28} />
    </SettingsList>
  </TouchableHighlight>
);

const SettingsList = styled.View`
  align-items: center;
  border-color: rgba(95, 95, 95, 0.3);
  border-top-width: 0.5;
  border-bottom-width: 0.5;
  flex-direction: row;
  justify-content: space-between;
  padding-bottom: 16px;
  padding-left: 16px;
  padding-right: 16px;
  padding-top: 16px;
  width: 100%;
`;

let SettingsListText;
// if (I18n.locale === 'ja-US') {
//   SettingsListText = styled.Text`
//     padding: 10px 12px 2px 12px;
//     color: #5f5f5f;
//     font-family: 'HKGrotesk-Regular';
//     font-size: 20;
//     margin-left: 16;
//     width: 80%;
//   `;
// } else {
  SettingsListText = styled.Text`
    padding: 8px 12px;
    color: #5f5f5f;
    font-family: 'HKGrotesk-Regular';
    font-size: 20;
    margin-left: 16;
    width: 80%;
  `;
// }

export { SettingsListCard };
