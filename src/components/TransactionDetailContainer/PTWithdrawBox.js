import React from 'react';
import styled from 'styled-components';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { GoyemonText } from '../common';

const PTWithdrawBox = props =>
    <SubtotalWithdrawBox>
    <Icon name={props.name} size={props.size + 10} color={props.color} />
    <GoyemonText fontSize={24}>
    {props.option.sum}
    {props.token}
    </GoyemonText>
    <LabelsBox>
        <GoyemonText fontSize={14}>Open</GoyemonText>
        <GoyemonText fontSize={14}>Committed</GoyemonText>
        <GoyemonText fontSize={14}>Sponsor</GoyemonText>
    </LabelsBox>
    <ValueBox>
        <GoyemonText fontSize={14}>{props.option.open}DAI</GoyemonText>
        <GoyemonText fontSize={14}>{props.option.committed}DAI</GoyemonText>
        <GoyemonText fontSize={14}>{props.option.sponsor}DAI</GoyemonText>
    </ValueBox>
    </SubtotalWithdrawBox>

const SubtotalWithdrawBox = styled.View`
flex-direction: row;
margin-left: 4%;
margin-top: 32;
margin-bottom: 32;
align-items: flex-start;
width: 90%;
`;

const LabelsBox = styled.View`
flex-direction: column;
margin-left: 22%;
`;

const ValueBox = styled.View`
flex-direction: column;
margin-left: 5%;
`

export default PTWithdrawBox
