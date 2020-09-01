'use strict';
import React from 'react';
import { GoyemonText } from '.';
import I18n from '../../i18n/I18n';
import TxStates from '../../lib/tx/TxStates';
import styled from 'styled-components/native';

interface AppProps {
  width: number;
  txState: number;
}

const TransactionStatus = (props: AppProps) => (
  <TransactionStatusContainer width={props.width} txState={props.txState}>
    {(() => {
      let text;
      switch (props.txState) {
        case TxStates.STATE_NEW:
        case TxStates.STATE_PENDING:
          text = I18n.t('history-pending') + '...';
          break;

        case TxStates.STATE_INCLUDED:
          text = I18n.t('history-success');
          break;

        case TxStates.STATE_CONFIRMED:
          text = I18n.t('history-success');
          break;

        case TxStates.STATE_GETH_ERROR:
          return (
            <FailedStatusText>{I18n.t('history-failed')}</FailedStatusText>
          );

        default:
        // TODO: exception?
      }

      return <GoyemonText fontSize={18}>{text}</GoyemonText>;
    })()}
  </TransactionStatusContainer>
);

const TransactionStatusContainer = styled.View`
  width: ${(props: AppProps) => props.width};
`;

const FailedStatusText = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  font-size: 18;
`;

export { TransactionStatus };
