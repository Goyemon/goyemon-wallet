"use strict";
import React from "react";
import styled from "styled-components/native";
import { GoyemonText } from "./Texts";

interface DescriptionProps {
  marginBottom: number;
  marginLeft: number;
  marginTop: number;
  children: any;
}

export const Description = (props: DescriptionProps) => (
  <DescriptionText
    marginBottom={props.marginBottom}
    marginLeft={props.marginLeft}
    marginTop={props.marginTop}
  >
    {props.children}
  </DescriptionText>
);

interface DescriptionTextProps {
  marginBottom: number | string;
  marginLeft: number | string;
  marginTop: number | string;
}

const DescriptionText = styled.Text`
  color: #5f5f5f;
  font-family: "HKGrotesk-Regular";
  font-size: 20;
  margin-bottom: ${(props: DescriptionTextProps) => `${props.marginBottom}`};
  margin-left: ${(props: DescriptionTextProps) => `${props.marginLeft}`};
  margin-top: ${(props: DescriptionTextProps) => `${props.marginTop}`};
  text-align: center;
`;

interface ApplicationDescriptionProps {
  children: any;
}

export const ApplicationDescription = (props: ApplicationDescriptionProps) => (
  <ApplicationDescriptionContainer>
    <GoyemonText fontSize={16}>{props.children}</GoyemonText>
  </ApplicationDescriptionContainer>
);

const ApplicationDescriptionContainer = styled.View`
  align-items: flex-start;
  margin: 16px auto;
  width: 90%;
`;
