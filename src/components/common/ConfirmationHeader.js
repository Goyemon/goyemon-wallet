'use strict';
import React from 'react';
import styled from 'styled-components/native';

const ConfirmationHeader = (props) => (
  <Header>
    <HeaderText>{props.children}</HeaderText>
  </Header>
);

const Header = styled.View`
  flex-direction: row;
  margin-bottom: 8;
`;

const HeaderText = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  text-transform: uppercase;
`;

export { ConfirmationHeader };
