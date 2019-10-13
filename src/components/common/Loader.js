'use strict';
import React from 'react';
import styled from 'styled-components';
import { Modal, ActivityIndicator } from 'react-native';

const Loader = props => {
  const { loading, ...attributes } = props;

  return (
    <Modal transparent animationType={'none'} visible={loading}>
      <ModalBackground>
        <ActivityIndicatorWrapper>
          <ActivityIndicator animating={loading} />
        </ActivityIndicatorWrapper>
      </ModalBackground>
    </Modal>
  );
};

const ModalBackground = styled.View`
  flex: 1;
  alignItems: center;
  flexDirection: column;
  justifyContent: space-around;
  backgroundColor: #00000040;
`;

const ActivityIndicatorWrapper = styled.View`
  backgroundColor: #FFFFFF;
  height: 120;
  width: 120;
  borderRadius: 16;
  display: flex;
  alignItems: center;
  justifyContent: space-around;
`;

export { Loader };
