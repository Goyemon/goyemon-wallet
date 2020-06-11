'use strict';
import React from 'react';
import styled from 'styled-components/native';

const HorizontalLine = (props) => (
  <LineContainer>
      <Line />
  </LineContainer>
);

const LineContainer = styled.View`
  align-items: center;
  margin-top: 12;
`;

const Line = styled.View`
  border-color: #5f5f5f;
  border-style: solid;
  border-width: 2;
  border-radius: 2;
  width: 20%;
`;

export { HorizontalLine };
