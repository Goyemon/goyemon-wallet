'use strict';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styled from 'styled-components/native';

const SettingsIcon = props => (
  <SettingsIconContainer>
    <Icon
      color="#5f5f5f"
      name="settings-outline"
      size={28}
      onPress={props.onPress}
    />
  </SettingsIconContainer>
);

const SettingsIconContainer = styled.TouchableOpacity`
  margin-top: 8px;
  margin-right: 16px;
`;

export { SettingsIcon };
