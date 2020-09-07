"use strict";
import React from "react";
import { GoyemonText } from "./Texts";
import I18n from "../../i18n/I18n";
import TxStates from "../../lib/tx/TxStates";
import styled from "styled-components/native";

interface TransactionStatusProps {
  width: number;
  txState: number;
}

export const TransactionStatus = (props: TransactionStatusProps) => (
  <TransactionStatusContainer width={props.width} txState={props.txState}>
    {(() => {
      let text;
      switch (props.txState) {
        case TxStates.STATE_NEW:
        case TxStates.STATE_PENDING:
          text = I18n.t("history-pending") + "...";
          break;

        case TxStates.STATE_INCLUDED:
          text = I18n.t("history-success");
          break;

        case TxStates.STATE_CONFIRMED:
          text = I18n.t("history-success");
          break;

        case TxStates.STATE_GETH_ERROR:
          return (
            <FailedStatusText>{I18n.t("history-failed")}</FailedStatusText>
          );

        default:
        // TODO: exception?
      }

      return <GoyemonText fontSize={18}>{text}</GoyemonText>;
    })()}
  </TransactionStatusContainer>
);

interface TransactionStatusContainerProps {
  width: number | string;
  txState: number;
}

const TransactionStatusContainer = styled.View`
  width: ${(props: TransactionStatusContainerProps) => props.width};
`;

const FailedStatusText = styled.Text`
  color: #5f5f5f;
  font-family: "HKGrotesk-Regular";
  font-size: 18;
`;
