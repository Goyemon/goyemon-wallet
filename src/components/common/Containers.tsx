'use strict';
import React from 'react';
import styled from 'styled-components/native';
import OfflineNotice from '../OfflineNotice';

interface ContainerProps {
  alignItems: string;
  flexDirection: string;
  justifyContent: string;
  marginTop: number | string;
  width: number | string;
  children: any;
}

export const Container = (props: ContainerProps) => (
  <ContainerInner
    alignItems={props.alignItems}
    flexDirection={props.flexDirection}
    justifyContent={props.justifyContent}
    marginTop={props.marginTop}
    width={props.width}
  >
    {props.children}
  </ContainerInner>
);

const ContainerInner = styled.View`
  align-items: ${(props) => props.alignItems};
  flex: 1;
  flex-direction: ${(props) => props.flexDirection};
  justify-content: ${(props) => props.justifyContent};
  margin: 0 auto;
  margin-top: ${(props) => props.marginTop};
  width: ${(props) => props.width};
`;

interface MenuContainerProps {
  onPress: () => void;
  children: any;
}

export const MenuContainer = (props: MenuContainerProps) => (
  <MenuContainerInner onPress={props.onPress}>
    {props.children}
  </MenuContainerInner>
);

const MenuContainerInner = styled.TouchableOpacity`
  align-items: center;
  flex-direction: row;
  justify-content: center;
  margin: 8px;
  margin-top: 8px;
  padding: 4px;
`;

interface RootContainerProps {
  children: any;
}

export const RootContainer = (props: RootContainerProps) => (
  <RootContainerStyle>
    <OfflineNotice />
    {props.children}
  </RootContainerStyle>
);

const RootContainerStyle = styled.ScrollView`
  background: #f8f8f8;
`;

interface TouchableCardContainerProps {
  onPress: () => void;
  alignItems: number | string;
  flexDirection: string;
  height: number | string;
  justifyContent: string;
  textAlign: number | string;
  width: number | string;
  children: any;
}

export const TouchableCardContainer = (props: TouchableCardContainerProps) => (
  <TouchableCardContainerInner
    onPress={props.onPress}
    alignItems={props.alignItems}
    flexDirection={props.flexDirection}
    height={props.height}
    justifyContent={props.justifyContent}
    textAlign={props.textAlign}
    width={props.width}
  >
    {props.children}
  </TouchableCardContainerInner>
);

const TouchableCardContainerInner = styled.TouchableOpacity`
  align-items: ${(props) => props.alignItems};
  background: #fff;
  border-radius: 8px;
  flex-direction: ${(props) => props.flexDirection};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  height: ${(props) => props.height};
  justify-content: ${(props) => props.justifyContent};
  margin: 8px auto;
  padding: 16px;
  text-align: ${(props) => props.textAlign};
  width: ${(props) => props.width};
`;

interface UntouchableCardContainerProps {
  alignItems: string;
  borderRadius: string;
  flexDirection: string;
  height: number | string;
  justifyContent: number | string;
  marginTop: number | string;
  textAlign: string;
  width: number | string;
  children: any
}

export const UntouchableCardContainer = (props: UntouchableCardContainerProps) => (
  <UntouchableCardContainerInner
    alignItems={props.alignItems}
    borderRadius={props.borderRadius}
    flexDirection={props.flexDirection}
    height={props.height}
    justifyContent={props.justifyContent}
    marginTop={props.marginTop}
    textAlign={props.textAlign}
    width={props.width}
  >
    {props.children}
  </UntouchableCardContainerInner>
);

const UntouchableCardContainerInner = styled.View`
  align-items: ${(props) => props.alignItems};
  background: #fff;
  border-radius: ${(props) => props.borderRadius};
  flex-direction: ${(props) => props.flexDirection};
  height: ${(props) => props.height};
  justify-content: ${(props) => props.justifyContent};
  margin: 16px auto;
  margin-top: ${(props) => props.marginTop};
  padding: 16px 24px;
  text-align: ${(props) => props.textAlign};
  width: ${(props) => props.width};
`;
