'use strict';
import React, { Component } from 'react';
import { Button } from 'react-native';
import styled from 'styled-components';

export default class Welcome extends Component {
  render() {
    return (
      <Container>
        <Title>Holla!</Title>
        <Title>ARE YOU READY?</Title>
        <Button title="Hell Yeah!" onPress={() => this.props.navigation.navigate('Start')} />
      </Container>
    );
  }
}

const Container = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
`;

const Title = styled.Text`
    font-size: 40px;
`;
