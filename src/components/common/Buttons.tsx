"use strict";
import React from "react";
import styled from "styled-components/native";
import I18n from "../../i18n/I18n";

interface ButtonProps {
  onPress: () => void;
  backgroundColor: string;
  borderColor: string;
  disabled: boolean;
  margin: number;
  marginBottom: number;
  opacity: number;
  textColor: string;
  text: string;
  children: any;
}

export const Button = (props: ButtonProps) => (
  <ButtonContainer
    onPress={props.onPress}
    backgroundColor={props.backgroundColor}
    borderColor={props.borderColor}
    disabled={props.disabled}
    margin={props.margin}
    marginBottom={props.marginBottom}
    opacity={props.opacity}
  >
    <ButtonText textColor={props.textColor}>{props.text}</ButtonText>
  </ButtonContainer>
);

interface ButtonContainerProps {
  backgroundColor: string;
  borderColor: string;
  margin: number | string;
  marginBottom: number | string;
  opacity: number | string;
}

const ButtonContainer = styled.TouchableOpacity`
  background-color: ${(props: ButtonContainerProps) => props.backgroundColor};
  border-color: ${(props: ButtonContainerProps) => props.borderColor};
  border-radius: 16px;
  border-width: 1;
  margin: ${(props: ButtonContainerProps) => props.margin};
  margin-bottom: ${(props: ButtonContainerProps) => props.marginBottom};
  min-width: 120px;
  opacity: ${(props: ButtonContainerProps) => props.opacity};
`;

interface ButtonTextProps {
  textColor: string;
}

const ButtonText: any = styled.Text`
  color: ${(props: ButtonTextProps) => props.textColor};
  font-family: "HKGrotesk-Bold";
  font-size: 20;
  padding: 12px 24px;
  text-align: center;
`;

interface MnemonicWordButtonProps {
  disabled: boolean;
  opacity: number | string;
  onPress: () => void;
  children: any;
}

export const MnemonicWordButton = (props: MnemonicWordButtonProps) => (
  <MnemonicWordButtonContainer
    disabled={props.disabled}
    opacity={props.opacity}
    onPress={props.onPress}
  >
    <MnemonicWordButtonText>{props.children}</MnemonicWordButtonText>
  </MnemonicWordButtonContainer>
);

interface MnemonicWordButtonContainer {
  opacity: number | string;
}

const MnemonicWordButtonContainer = styled.TouchableOpacity`
  background-color: #fff;
  border-color: #fff;
  border-radius: 16px;
  border-width: 1;
  margin: 0 auto;
  min-width: 80px;
  opacity: ${(props: MnemonicWordButtonContainer) => props.opacity};
`;

const MnemonicWordButtonText = styled.Text`
  color: #5f5f5f;
  font-family: "HKGrotesk-Bold";
  font-size: 16;
  padding: 8px 12px;
  text-align: center;
`;

interface TxConfirmationButtonProps {
  disabled: boolean;
  onPress: () => void;
  text: string;
}

export const TxConfirmationButton = (props: TxConfirmationButtonProps) => (
  <TxConfirmationButtonContainer
    disabled={props.disabled}
    onPress={props.onPress}
  >
    <TxConfirmationButtonText>{props.text}</TxConfirmationButtonText>
  </TxConfirmationButtonContainer>
);

const TxConfirmationButtonContainer = styled.TouchableOpacity`
  background-color: #00a3e2;
  border-color: #00a3e2;
  border-radius: 16px;
  border-width: 1;
  margin-bottom: 24px;
  min-width: 120px;
`;

const TxConfirmationButtonText = styled.Text`
  color: #fff;
  font-family: "HKGrotesk-Bold";
  font-size: ${I18n.locale == "ja-US" ? 18 : 20};
  padding: ${I18n.locale == "ja-US" ? "14px 24px 8px 24px" : "12px 24px"};
  text-align: center;
`;

interface TxNextButtonProps {
  disabled: boolean;
  opacity: number | string;
  onPress: () => void;
}

export const TxNextButton = (props: TxNextButtonProps) => (
  <TxNextButtonContainer
    disabled={props.disabled}
    opacity={props.opacity}
    onPress={props.onPress}
  >
    <TxNextButtonText>{I18n.t("button-next")}</TxNextButtonText>
  </TxNextButtonContainer>
);

interface TxNextButtonContainerProps {
  opacity: number | string;
}

const TxNextButtonContainer = styled.TouchableOpacity`
  background-color: #fff;
  border-color: #00a3e2;
  border-radius: 16px;
  border-width: 1;
  margin: 40px auto;
  margin-bottom: 12px;
  min-width: 120px;
  opacity: ${(props: TxNextButtonContainerProps) => props.opacity};
`;

const TxNextButtonText: any = styled.Text`
  color: #00a3e2;
  font-family: "HKGrotesk-Bold";
  font-size: 20;
  padding: 12px 24px;
  text-align: center;
`;

interface UseMaxButtonProps {
  onPress: () => void;
  textColor: string;
  text: string;
}

export const UseMaxButton = (props: UseMaxButtonProps) => (
  <UseMaxButtonContainer onPress={props.onPress}>
    <UseMaxButtonText textColor={props.textColor}>
      {props.text}
    </UseMaxButtonText>
  </UseMaxButtonContainer>
);

interface UseMaxButtonContainerProps {
  textColor: string;
}

const UseMaxButtonContainer = styled.TouchableOpacity`
  align-items: flex-end;
`;

const UseMaxButtonText = styled.Text`
  color: ${(props: UseMaxButtonContainerProps) => props.textColor};
  font-family: "HKGrotesk-Regular";
  font-size: 14;
`;

interface BuyCryptoButtonProps {
  onPress: () => void;
  textColor: string;
  text: string;
}

export const BuyCryptoButton = (props: BuyCryptoButtonProps) => (
  <BuyCryptoButtonContainer onPress={props.onPress}>
    <BuyCryptoButtonText>Buy Crypto Now!</BuyCryptoButtonText>
  </BuyCryptoButtonContainer>
);

const BuyCryptoButtonContainer = styled.TouchableOpacity`
  align-items: flex-end;
`;

const BuyCryptoButtonText = styled.Text`
  color: #00a3e2;
  font-family: "HKGrotesk-Regular";
  font-size: 20;
  margin-top: 40;
`;
