'use strict';
import React from 'react';
import styled from 'styled-components/native';

const MenuContainer = props => <MenuContainerInner>{props.children}</MenuContainerInner>;

const MenuContainerInner = styled.View`
  align-items: center;
  flex-direction: column;
  justify-content: center;
  margin: 0 8px;
`;

export { MenuContainer };
