'use strict';
import React from 'react';
import { Container } from '.';
import styled from 'styled-components/native';

interface ProgressBarProps {
  marginRight: number | string;
  width: number | string;
  oneColor: string;
  twoColor: string;
  threeColor: string;
}

export const ProgressBar = (props: ProgressBarProps) => (
  <Container
    alignItems="center"
    flexDirection="column"
    justifyContent="center"
    marginTop={112}
    width="100%"
  >
    <Outer />
    <InnerContainer marginRight={props.marginRight} width={props.width}>
      <Inner />
    </InnerContainer>
    <NumberContainer>
      <OneContainer oneColor={props.oneColor}>
        <One>1</One>
      </OneContainer>
      <TwoContainer twoColor={props.twoColor}>
        <Two>2</Two>
      </TwoContainer>
      <ThreeContainer threeColor={props.threeColor}>
        <Three>3</Three>
      </ThreeContainer>
    </NumberContainer>
  </Container>
);

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
  margin-top: -8;
  margin-right: ${(props) => props.marginRight};
  width: ${(props) => props.width};
`;

const Inner = styled.View`
  text-align: left;
`;

const NumberContainer = styled.View`
  align-items: center;
  flex: 1;
  flex-direction: row;
  justify-content: space-around;
  margin-top: -16;
  width: 115%;
`;

const OneContainer = styled.View`
  align-items: center;
  background-color: ${(props) => props.oneColor};
  border-radius: 10px;
  height: 20px;
  justify-content: center;
  width: 20px;
`;

const One = styled.Text`
  color: #fff;
  font-family: 'HKGrotesk-Bold';
`;

const TwoContainer = styled.View`
  align-items: center;
  background-color: ${(props) => props.twoColor};
  border-radius: 10px;
  height: 20px;
  justify-content: center;
  width: 20px;
`;

const Two = styled.Text`
  color: #fff;
  font-family: 'HKGrotesk-Bold';
`;

const ThreeContainer = styled.View`
  align-items: center;
  background-color: ${(props) => props.threeColor};
  border-radius: 10px;
  height: 20px;
  justify-content: center;
  width: 20px;
`;

const Three = styled.Text`
  color: #fff;
  font-family: 'HKGrotesk-Bold';
`;
