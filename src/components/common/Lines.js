'use strict';
import React from 'react';
import styled from 'styled-components/native';

const ModalHandler = (props) => (
  <LineContainer>
    <ModalHandlerLine />
  </LineContainer>
);

const LineContainer = styled.View`
  align-items: center;
  margin-top: 12;
`;

const ModalHandlerLine = styled.View`
  border-color: #5f5f5f;
  border-style: solid;
  border-width: 2;
  border-radius: 2;
  width: 10%;
`;

const HorizontalLine = (props) => (
  <HorizontalLineContainer>
    <Line borderColor={props.borderColor} />
  </HorizontalLineContainer>
);

const HorizontalLineContainer = styled.View`
  margin: 0 auto;
  width: 95%;
`;

const Line = styled.View`
  border-color: ${(props) => props.borderColor};
  border-radius: 1.6;
  border-width: 1.6;
  border-style: solid;
`;

export { ModalHandler, HorizontalLine };
