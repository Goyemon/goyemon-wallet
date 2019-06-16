'use strict';
import React from 'react';
import styled from 'styled-components/native';

const RootContainer = props => (
    <RootContainerStyle>
      {props.children}
    </RootContainerStyle>
);

const RootContainerStyle = styled.ScrollView`
  background: #F8F8F8;
`;

export { RootContainer };
