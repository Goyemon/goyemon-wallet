'use strict';
import React from 'react';
import { Text } from 'react-native';
import styled from 'styled-components';

const ProgressBar = props => (
  <Container>
    <Outer />
    <InnerContainer marginRight={props.marginRight} width={props.width}>
      <Inner />
    </InnerContainer>
    <NumberContainer>
      <OneContainer oneColor={props.oneColor}>
        <One>1</One>
      </OneContainer>
      <TwoContainer twoColor={props.twoColor} r>
        <Two>2</Two>
      </TwoContainer>
      <ThreeContainer threeColor={props.threeColor}>
        <Three>3</Three>
      </ThreeContainer>
    </NumberContainer>
  </Container>
);

const Container = styled.View`
  alignItems: center;
  margin-top: 112px;
`;

const Outer = styled.View`
  background-color: #eeeeee;
  border-radius: 16px;
  height: 8px;
  width: 80%;
`;

const InnerContainer = styled.View`
  background-color: #fdc800;
  border-radius: 16px;
  height: 8px;
  margin-top: -8px;
  margin-right: ${props => props.marginRight};
  width: ${props => props.width};
`;

const Inner = styled.View`
  text-align: left;
`;

const NumberContainer = styled.View`
  alignItems: center;
  flex: 1;
  flexDirection: row;
  justifyContent: space-around;
  margin-top: -16px;
  width: 115%;
`;

const OneContainer = styled.View`
  alignItems: center;
  background-color: ${props => props.oneColor};
  border-radius: 10px;
  height: 20px;
  justifyContent: center;
  width: 20px;
`;

const One = styled.Text`
  color: #fff;
  font-family: 'HKGrotesk-Bold';
`;

const TwoContainer = styled.View`
  alignItems: center;
  background-color: ${props => props.twoColor};
  border-radius: 10px;
  height: 20px;
  justifyContent: center;
  width: 20px;
`;

const Two = styled.Text`
  color: #fff;
  font-family: 'HKGrotesk-Bold';
`;

const ThreeContainer = styled.View`
  alignItems: center;
  background-color: ${props => props.threeColor};
  border-radius: 10px;
  height: 20px;
  justifyContent: center;
  width: 20px;
`;

const Three = styled.Text`
  color: #fff;
  font-family: 'HKGrotesk-Bold';
`;

export { ProgressBar };
