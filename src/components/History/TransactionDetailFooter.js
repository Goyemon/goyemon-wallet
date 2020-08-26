import React from 'react';
import { Linking, View } from 'react-native';
import styled from 'styled-components';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { HeaderFive } from '../common';
import { TxStates } from '../../lib/tx';
import LogUtilities from '../../utilities/LogUtilities';
import GlobalConfig from '../../config.json';

const TransactionDetailFooter = (props) => (
  <TxNetworkAndHash>
    {props.service !== '' && (
      <>
        <HeaderFive fontSize={20}>Application</HeaderFive>
        <TxDetailValue>{props.service}</TxDetailValue>
      </>
    )}
    {props.from ? (
      <>
        <HeaderFive fontSize={20}>From</HeaderFive>
        <TxDetailValue>{props.from.substring(0, 24) + '...'}</TxDetailValue>
      </>
    ) : props.to ? (
      <>
        <HeaderFive fontSize={20}>To</HeaderFive>
        <TxDetailValue>{props.to.substring(0, 24) + '...'}</TxDetailValue>
      </>
    ) : null}
    {props.status > TxStates.STATE_PENDING ? (
      <HeaderFive fontSize={20}>Network Fee Paid</HeaderFive>
    ) : (
      <HeaderFive fontSize={20}>Max Network Fee</HeaderFive>
    )}
    <TxDetailValue>{props.networkFee} ETH</TxDetailValue>
    {props.status >= TxStates.STATE_PENDING && (
      <View>
        <HeaderFive fontSize={20}>Hash</HeaderFive>
        <TxDetailValue
          onPress={() => {
            Linking.openURL(
              `${GlobalConfig.EtherscanLink}${'0x' + props.hash}`
            ).catch((err) => LogUtilities.logError('An error occurred', err));
          }}
        >
          {'0x' + props.hash.substring(0, 24) + '...'}
          <Icon name="link-variant" size={16} color="#5f5f5f" />
        </TxDetailValue>
      </View>
    )}
  </TxNetworkAndHash>
);

const TxNetworkAndHash = styled.View`
  align-items: flex-start;
  font-family: 'HKGrotesk-Regular';
  justify-content: flex-start;
  flex-direction: column;
  margin: 24px auto;
  width: 90%;
`;

const TxDetailValue = styled.Text`
  color: #000;
  font-family: 'HKGrotesk-Bold';
  font-size: 18;
  margin-top: 4;
  margin-bottom: 16;
`;

export default TransactionDetailFooter;
