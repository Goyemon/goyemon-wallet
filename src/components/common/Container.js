'use strict';
import React from 'react';
import styled from 'styled-components/native';

const Container = (props) => (
  <ContainerInner
    alignItems={props.alignItems}
    flexDirection={props.flexDirection}
    justifyContent={props.justifyContent}
    marginTop={props.marginTop}
    width={props.width}
  >
    {props.children}
  </ContainerInner>
);

const ContainerInner = styled.View`
  align-items: ${(props) => props.alignItems};
  flex: 1;
  flex-direction: ${(props) => props.flexDirection};
  justify-content: ${(props) => props.justifyContent};
  margin: 0 auto;
  margin-top: ${(props) => props.marginTop};
  width: ${(props) => props.width};
`;

export { Container };
