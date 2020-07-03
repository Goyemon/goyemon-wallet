import React from 'react';
import { TouchableCardContainer, GoyemonText } from '../../components/common';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CompoundIcon from '../../../assets/CompoundIcon.js';
import PoolTogetherIcon from '../../../assets/PoolTogetherIcon.js';
import styled from 'styled-components';

const ApplicationBoxes = props =>
  <>
    {props.boxes.map(application =>
      <ApplicationBox
        balance={application.balance}
        name={application.name}
        onPress={application.event}
      />)
    }
  </>

const ApplicationBox = props =>
  <TouchableCardContainer
    alignItems="center"
    flexDirection="row"
    height="120px"
    justifyContent="space-between"
    textAlign="left"
    width="90%"
    onPress={props.onPress}
  >
    <IconImageContainer>
      {(() => {switch(props.name) {
        case 'Wallet':
          return <Icon name="wallet-outline" size={40} color="#5f5f5f" />
        case 'Compound':
          return <CompoundIcon />
        case 'PoolTogether':
          return <PoolTogetherIcon />
      }})()}
    </IconImageContainer>
    <NameContainer>
      <NameText>{props.name}</NameText>
      {props.name === 'Wallet' && <GoyemonText fontSize={12}>ETH and ERC20</GoyemonText>}
    </NameContainer>
    <BalanceContainer>
      <ApplicationBalanceText>
        ${props.balance}
      </ApplicationBalanceText>
    </BalanceContainer>
  </TouchableCardContainer>

const IconImageContainer = styled.View`
  align-items: center;
  width: 20%;
`;

const NameContainer = styled.View`
  margin-left: 16;
  width: 45%;
`;

const NameText = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  font-size: 20;
`;

const BalanceContainer = styled.View`
  width: 35%;
`;

const ApplicationBalanceText = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  font-size: 20;
`;

export default ApplicationBoxes
