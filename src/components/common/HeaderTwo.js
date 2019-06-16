'use strict';
import React from 'react';
import styled from 'styled-components/native';

const HeaderTwo = props => (
    <HeaderTwoText
       fontSize={props.fontSize}
     >
     {props.children}
    </HeaderTwoText>
);

const HeaderTwoText = styled.Text`
  font-size: ${props => props.fontSize};
  font-weight: bold;
  text-transform: uppercase;
`;

export { HeaderTwo };
