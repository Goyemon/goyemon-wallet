'use strict';
import React from 'react';
import styled from 'styled-components/native';

const HeaderOne = props => (
    <HeaderOneText>
      {props.children}
    </HeaderOneText>
);

const HeaderOneText = styled.Text`
  font-size: 32px;
  font-weight: bold;
  margin-left: 16px;
  margin-top: 96px;
`;

export { HeaderOne };
