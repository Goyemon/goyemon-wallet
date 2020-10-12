"use strict";
import React from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import styled from "styled-components/native";
import { UntouchableCardContainer, Button, GoyemonText } from "../../common";

const WarningBox = (props) => (
  <UntouchableCardContainer
    alignItems="flex-start"
    background="#f4efe9"
    borderRadius="8px"
    flexDirection="column"
    height="200px"
    justifyContent="center"
    marginTop="0"
    textAlign="left"
    width="90%"
  >
    <WarningMessage>
      <Icon name="alert-circle-outline" color="#e41b13" size={24} />
      <GoyemonText fontSize={20}>Not backed up</GoyemonText>
    </WarningMessage>
    <GoyemonText fontSize={16}>
      If your device gets lost or if there&apos;s an unexpected hardware error,
      you will lose your funds forever.
    </GoyemonText>
    <Button
      text="Back Up Now"
      textColor="#5F5F5F"
      backgroundColor="#FFF"
      borderColor="#FFF"
      disabled={false}
      margin="12px 0"
      marginBottom="0"
      opacity="1"
      onPress={props.onPress}
    />
  </UntouchableCardContainer>
);

const WarningMessage = styled.View`
  flex-direction: row;
  margin-bottom: 6px;
`;

export default WarningBox;
