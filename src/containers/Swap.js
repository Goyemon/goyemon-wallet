'use strict';
import React, { Component } from 'react';
import { RootContainer, Container, HeaderOne, HeaderTwo } from '../components/common';

export default class Swap extends Component {
  render() {
    return (
      <RootContainer>
        <HeaderOne marginTop="64">Swap</HeaderOne>
        <Container alignItems="center" flexDirection="row"  justifyContent="center" marginTop={0} width="100%">
          <HeaderTwo
            fontSize="24"
            fontWeight="bold"
            marginBottom="16"
            marginLeft="0"
            marginTop="240"
          >
            coming soon!
          </HeaderTwo>
        </Container>
      </RootContainer>
    );
  }
}
