"use strict";
import React from "react";
import styled from "styled-components/native";
import { HorizontalLine } from "./";

interface GoyemonTextProps {
  fontSize: string | number;
  onPress?: () => void;
  children: any;
}

export const GoyemonText = (props: GoyemonTextProps) => (
  <HKGroteskText fontSize={props.fontSize} onPress={props.onPress}>
    {props.children}
  </HKGroteskText>
);

const HKGroteskText = styled.Text`
  color: #5f5f5f;
  font-family: "HKGrotesk-Regular";
  font-size: ${(props) => props.fontSize};
`;

interface ToggleTextProps {
  fontSize: number;
  isSelected: boolean;
  onPress?: () => void;
  children: any;
  text: string;
}

export const ToggleText = (props: ToggleTextProps) => (
  <>
    {props.isSelected ? (
      <ToggleTextOnView>
        <ToggleInner fontSize={props.fontSize} onPress={props.onPress}>
          {props.text}
        </ToggleInner>
        <HorizontalLine borderColor="#00a3e2" />
      </ToggleTextOnView>
    ) : (
      <ToggleTextOffView>
        <ToggleInner fontSize={props.fontSize} onPress={props.onPress}>
          {props.text}
        </ToggleInner>
        <HorizontalLine borderColor="#f8f8f8" />
      </ToggleTextOffView>
    )}
  </>
);

const ToggleTextOnView = styled.View`
  color: #5f5f5f;
  font-family: "HKGrotesk-Regular";
`;

const ToggleTextOffView = styled.View`
  color: #5f5f5f;
  font-family: "HKGrotesk-Regular";
`;

const ToggleInner = styled.Text`
  color: #000;
  font-family: "HKGrotesk-Bold";
  font-size: ${(props) => props.fontSize};
  text-align: center;
  font-family: "HKGrotesk-Bold";
  text-transform: uppercase;
  padding-bottom: 4px;
`;

interface ConfirmationTextProps {
  children: any;
}

export const ConfirmationText = (props: ConfirmationTextProps) => (
  <Text>{props.children}</Text>
);

const Text = styled.Text`
  color: #000;
  font-family: "HKGrotesk-Bold";
  font-size: 20;
  margin-top: 4;
  margin-bottom: 24;
`;
