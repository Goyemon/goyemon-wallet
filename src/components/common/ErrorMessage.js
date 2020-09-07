"use strict";
import React from "react";
import styled from "styled-components/native";

const ErrorMessage = (props) => (
  <ErrorMessageText textAlign={props.textAlign}>
    {props.children}
  </ErrorMessageText>
);

const ErrorMessageText = styled.Text`
  color: #e41b13;
  font-family: "HKGrotesk-Regular";
  text-align: ${(props) => props.textAlign};
  width: 100%;
`;

export { ErrorMessage };
