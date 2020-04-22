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
  width: 80%;
`;

const HeaderText = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  text-transform: uppercase;
`;

export { ConfirmationHeader };
