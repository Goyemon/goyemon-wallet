'use strict';
import React from 'react';
import styled from 'styled-components/native';

const HeaderOne = (props) => (
  <HeaderOneText marginTop={props.marginTop}>{props.children}</HeaderOneText>
);

const NewHeaderOne = (props) => (
  <HeaderOneText marginTop={props.marginTop}>{props.text}</HeaderOneText>
);

const HeaderOneText = styled.Text`
  font-size: 32;
  font-family: 'HKGrotesk-Bold';
  margin-left: 16;
  margin-top: ${(props) => `${props.marginTop}`};
`;

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

const NewHeaderThree = (props) => (
  <HeaderThreeText
    color={props.color}
    marginBottom={props.marginBottom}
    marginLeft={props.marginLeft}
    marginTop={props.marginTop}
  >
    {props.text}
  </HeaderThreeText>
);

const HeaderThree = (props) => (
  <HeaderThreeText
    color={props.color}
    marginBottom={props.marginBottom}
    marginLeft={props.marginLeft}
    marginTop={props.marginTop}
  >
    {props.children}
  </HeaderThreeText>
);

const HeaderThreeText = styled.Text`
  color: ${(props) => props.color};
  font-family: 'HKGrotesk-Bold';
  font-size: 16;
  margin-bottom: ${(props) => `${props.marginBottom}`};
  margin-left: ${(props) => `${props.marginLeft}`};
  margin-top: ${(props) => `${props.marginTop}`};
  text-transform: uppercase;
`;

const NewHeaderFour = (props) => (
  <HeaderFourText marginTop={props.marginTop}>{props.text}</HeaderFourText>
);

const HeaderFour = (props) => (
  <HeaderFourText marginTop={props.marginTop}>{props.children}</HeaderFourText>
);

const HeaderFourText = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  font-size: 20;
  margin-bottom: 16;
  margin-top: ${(props) => `${props.marginTop}`};
  text-transform: uppercase;
`;

const HeaderFive = (props) => (
  <Header width={props.width}>
    <HeaderText>{props.children}</HeaderText>
  </Header>
);

const Header = styled.View`
  flex-direction: row;
  width: ${(props) => `${props.width}`};
`;

const HeaderText = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  text-transform: uppercase;
`;

const FormHeader = (props) => (
  <FormHeaderContainer>
    <FormHeaderText
      marginBottom={props.marginBottom}
      marginTop={props.marginTop}
    >
      {props.children}
    </FormHeaderText>
  </FormHeaderContainer>
);

const FormHeaderContainer = styled.View`
  flex-direction: row;
  width: 80%;
`;

const FormHeaderText = styled.Text`
  color: #000;
  font-family: 'HKGrotesk-Bold';
  font-size: 20;
  margin-bottom: ${(props) => `${props.marginBottom}`};
  margin-top: ${(props) => `${props.marginTop}`};
`;

export {
  HeaderOne,
  NewHeaderOne,
  HeaderTwo,
  NewHeaderThree,
  HeaderThree,
  NewHeaderFour,
  HeaderFour,
  HeaderFive,
  FormHeader,
};
