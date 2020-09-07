import React from "react";
import styled from "styled-components";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { GoyemonText } from "../common";

const NormalBox = (props) => (
  <>
    {props.amount && (
      <SubtotalBox>
        <Icon name={props.name} size={props.size + 10} color={props.color} />
        <GoyemonText fontSize={24}>
          {props.amount}
          {props.token}
        </GoyemonText>
      </SubtotalBox>
    )}
  </>
);

const SubtotalBox = styled.View`
  font-family: "HKGrotesk-Regular";
  flex-direction: row;
  margin-left: 4%;
  margin-top: 32;
  margin-bottom: 32;
  align-items: center;
  width: 90%;
`;

export default NormalBox;
