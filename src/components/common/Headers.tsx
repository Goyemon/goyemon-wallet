'use strict';
import React from 'react';
import styled from 'styled-components/native';

interface HeaderOneProps {
  marginTop: number;
  children: any;
}

export const HeaderOne = (props: HeaderOneProps) => (
  <HeaderOneText marginTop={props.marginTop}>{props.children}</HeaderOneText>
);

interface NewHeaderOneProps {
  marginTop: string | number;
  text: string;
}

export const NewHeaderOne = (props: NewHeaderOneProps) => (
  <HeaderOneText marginTop={props.marginTop}>{props.text}</HeaderOneText>
);

const HeaderOneText = styled.Text`
  font-size: 32;
  font-family: 'HKGrotesk-Bold';
  margin-left: 16;
  margin-top: ${(props) => `${props.marginTop}`};
`;

interface HeaderTwoProps {
  marginBottom: string | number;
  marginLeft: string | number;
  marginTop: string | number;
  children: any
}

export const HeaderTwo = (props: HeaderTwoProps) => (
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

interface NewHeaderThreeProps {
  color: string;
  marginBottom: string | number;
  marginLeft: string | number;
  marginTop: string | number;
  text: string;
}

export const NewHeaderThree = (props: NewHeaderThreeProps) => (
  <HeaderThreeText
    color={props.color}
    marginBottom={props.marginBottom}
    marginLeft={props.marginLeft}
    marginTop={props.marginTop}
  >
    {props.text}
  </HeaderThreeText>
);

interface HeaderThreeProps {
  color: string;
  marginBottom: string | number;
  marginLeft: string | number;
  marginTop: string | number;
  children: any;
}

export const HeaderThree = (props: HeaderThreeProps) => (
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

interface NewHeaderFourProps {
  marginTop: string | number;
  text: string;
}

export const NewHeaderFour = (props: NewHeaderFourProps) => (
  <HeaderFourText marginTop={props.marginTop}>{props.text}</HeaderFourText>
);

interface HeaderFourProps {
  marginTop: string;
  children: any;
}

export const HeaderFour = (props: HeaderFourProps) => (
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

interface HeaderFiveProps {
  width: string;
  children: any;
}

export const HeaderFive = (props: HeaderFiveProps) => (
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

interface FormHeaderProps {
  marginBottom: string | number;
  marginTop: string | number;
  children: any;
}

export const FormHeader = (props: FormHeaderProps) => (
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
  width: 75%;
`;

const FormHeaderText = styled.Text`
  color: #000;
  font-family: 'HKGrotesk-Bold';
  font-size: 20;
  margin-bottom: ${(props) => `${props.marginBottom}`};
  margin-top: ${(props) => `${props.marginTop}`};
`;
