'use strict';
import React from 'react';
import styled from 'styled-components/native';

const MenuContainer = (props) => (
  <MenuContainerInner onPress={props.onPress}>
    {props.children}
  </MenuContainerInner>
);

const MenuContainerInner = styled.TouchableOpacity`
  align-items: center;
  flex-direction: row;
  justify-content: center;
  margin: 8px;
  margin-top: 8px;
  padding: 4px;
`;

export { MenuContainer };
