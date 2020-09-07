"use strict";
import React from "react";
import styled from "styled-components/native";

interface FormProps {
  borderColor: string;
  borderWidth: number;
  height: number;
  children: any;
}

export const Form = (props: FormProps) => (
  <FormCardContainer
    borderColor={props.borderColor}
    borderWidth={props.borderWidth}
    height={props.height}
  >
    {props.children}
  </FormCardContainer>
);

const FormCardContainer = styled.View`
  align-items: center;
  background: #fff;
  border-radius: 8px;
  border-color: ${(props) => props.borderColor};
  border-width: ${(props) => props.borderWidth};
  flex-direction: column;
  height: ${(props) => props.height};
  justify-content: flex-start;
  margin: 16px auto;
  padding: 16px;
  width: 90%;
`;

interface SwapFormProps {
  borderBottomColor: string;
  borderBottomWidth: string | number;
  height: string | number;
  children: any;
}

export const SwapForm = (props: SwapFormProps) => (
  <SwapFormCardContainer
    borderBottomColor={props.borderBottomColor}
    borderBottomWidth={props.borderBottomWidth}
    height={props.height}
  >
    {props.children}
  </SwapFormCardContainer>
);

const SwapFormCardContainer = styled.View`
  background: #fff;
  border-radius: 0;
  border-bottom-color: ${(props) => props.borderBottomColor};
  border-bottom-width: ${(props) => props.borderBottomWidth};
  width: 80%;
`;
