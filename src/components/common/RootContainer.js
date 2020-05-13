'use strict';
import React from 'react';
import styled from 'styled-components/native';
import OfflineNotice from '../../containers/common/OfflineNotice';

const RootContainer = (props) => (
  <RootContainerStyle>
    <OfflineNotice />
    {props.children}
  </RootContainerStyle>
);

const RootContainerStyle = styled.ScrollView`
  background: #f8f8f8;
`;

export { RootContainer };
