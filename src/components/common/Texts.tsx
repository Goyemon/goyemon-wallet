"use strict";
import React from "react";
import styled from "styled-components/native";

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
        <HKGroteskText fontSize={props.fontSize} onPress={props.onPress}>
          {props.text}
        </HKGroteskText>
      </ToggleTextOnView>
    ) : (
      <ToggleTextOffView>
        <HKGroteskText fontSize={props.fontSize} onPress={props.onPress}>
          {props.text}
        </HKGroteskText>
      </ToggleTextOffView>
    )}
  </>
);

const HKGroteskText = styled.Text`
  color: #5f5f5f;
  font-family: "HKGrotesk-Regular";
  text-align: center;
  font-size: ${(props) => props.fontSize};
`;

const ToggleTextOnView = styled.View`
  color: #5f5f5f;
  font-family: "HKGrotesk-Regular";
  border-bottom-color: #46d2e8;
  border-bottom-width: 2;
`;

const ToggleTextOffView = styled.View`
  color: #5f5f5f;
  font-family: "HKGrotesk-Regular";
  border-bottom-color: #f4f4f4;
  border-bottom-width: 2;
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
