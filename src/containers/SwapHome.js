'use strict';
import React, { Component } from 'react';
import styled from 'styled-components/native';
import { RootContainer, HeaderTwo } from '../components/common';

export default class Welcome extends Component {
  render() {
    return (
      <RootContainer>
        <Container>
          <HeaderTwo
            fontSize="24"
            fontWeight="bold"
            marginBottom="16"
            marginLeft="0"
            marginTop="400"
          >
            coming soon!
          </HeaderTwo>
        </Container>
      </RootContainer>
    );
  }
}

const Container = styled.View`
  flex: 1;
  text-align: center;
`;
