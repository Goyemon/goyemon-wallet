'use strict';
import React from 'react';
import styled from 'styled-components/native';

const RootContainer = props => <RootContainerStyle>{props.children}</RootContainerStyle>;

const RootContainerStyle = styled.ScrollView`
  background: #f8f8f8;
`;

export { RootContainer };
