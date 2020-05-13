'use strict';
import React from 'react';
import styled from 'styled-components/native';

const HeaderTwo = (props) => (
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
  font-family: 'HKGrotesk-Bold';
  font-size: 24;
  margin-bottom: ${(props) => `${props.marginBottom}`};
  margin-left: ${(props) => `${props.marginLeft}`};
  margin-top: ${(props) => `${props.marginTop}`};
  text-align: center;
  width: 95%;
`;

export { HeaderTwo };
