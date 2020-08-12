'use strict';
import React from 'react';
import styled from 'styled-components/native';
import { GoyemonText } from './';
import I18n from '../../i18n/I18n';
import TxStorage from '../../lib/tx.js';

const TransactionStatus = (props) => (
  <TransactionStatusContainer width={props.width} txState={props.txState}>
    {(() => {
      let text;
      switch (props.txState) {
        case TxStorage.TxStates.STATE_NEW:
        case TxStorage.TxStates.STATE_PENDING:
          text = I18n.t('history-pending') + '...';
          break;

        case TxStorage.TxStates.STATE_INCLUDED:
          text = I18n.t('history-success');
          break;

        case TxStorage.TxStates.STATE_CONFIRMED:
          text = I18n.t('history-success');
          break;

        case TxStorage.TxStates.STATE_GETH_ERROR:
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
  width: ${(props) => props.width};
`;

const FailedStatusText = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  font-size: 18;
`;

export { TransactionStatus };
