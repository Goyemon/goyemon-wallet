'use strict';
import React from 'react';
import styled from 'styled-components/native';

const HeaderTwo = props => (
  <HeaderTwoText
    marginBottom={props.marginBottom}
    marginLeft={props.marginLeft}
    marginTop={props.marginTop}
  >
    {props.children}
  </HeaderTwoText>
);

const HeaderTwoText = styled.Text`
  color: #5f5f5f;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: ${props => `${props.marginBottom}px`};
  margin-left: ${props => `${props.marginLeft}px`};
  margin-top: ${props => `${props.marginTop}px`};
  text-align: center;
  width: 95%;
`;

export { HeaderTwo };
