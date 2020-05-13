'use strict';
import React from 'react';
import styled from 'styled-components/native';

const HeaderFive = (props) => (
  <Header width={props.width}>
    <HeaderText>{props.children}</HeaderText>
  </Header>
);

const Header = styled.View`
  flex-direction: row;
  width: ${(props) => `${props.width}`};
`;

const HeaderText = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  text-transform: uppercase;
`;

export { HeaderFive };
