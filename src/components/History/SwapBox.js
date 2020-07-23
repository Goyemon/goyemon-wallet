import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styled from 'styled-components';
import { HeaderFive, GoyemonText } from '../common';

const SwapBox = (props) => (
  <SubtotalSwapBox>
    <HeaderFive>Sold</HeaderFive>
    <SoldBox>
      <Icon name="minus" size={26} color="#F1860E" />
      <GoyemonText fontSize={24}>{props.option.eth}ETH</GoyemonText>
    </SoldBox>
    <HeaderFive>Bought</HeaderFive>
    <BoughtBox>
      <Icon name="plus" size={26} color="#1BA548" />
      <GoyemonText fontSize={24}>{props.option.dai}DAI</GoyemonText>
    </BoughtBox>
  </SubtotalSwapBox>
);

const SubtotalSwapBox = styled.View`
  flex-direction: column;
  margin-left: 4%;
  margin-top: 32;
  margin-bottom: 32;
  align-items: flex-start;
  width: 90%;
`;

const SoldBox = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 4;
  margin-bottom: 16;
`;

const BoughtBox = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 4;
`;

export default SwapBox;
