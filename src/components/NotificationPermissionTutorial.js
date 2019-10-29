'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { RootContainer, ProgressBar, Button, OneLiner, HeaderThree } from '../components/common';
import styled from 'styled-components/native';

class NotificationPermissionTutorial extends Component {
  render() {
    return (
      <RootContainer>
        <ProgressBar text="3" width="100%" />
        <OneLiner fontSize="24px" fontWeight="bold" marginBottom="0" marginLeft="0" marginTop="40">
          Almost done!
        </OneLiner>
        <Container>
          <HeaderThree color="#000" fontSize="20px" marginBottom="8" marginLeft="8" marginTop="16">
            We use a notification system to process your transactions. But we will never annoy you
            with a pop-up notification.{' '}
          </HeaderThree>
          <Button
            text="Enable Now"
            textColor="white"
            backgroundColor="#009DC4"
            margin="16px auto"
            opacity="1"
            onPress={() => this.props.navigation.navigate('NotificationPermission')}
          />
        </Container>
      </RootContainer>
    );
  }
}

const Container = styled.View`
  flex: 1;
  justify-content: center;
  margin-top: 40px;
  text-align: center;
`;

const mapStateToProps = state => ({
    web3: state.ReducerWeb3.web3
  });

export default connect(mapStateToProps)(NotificationPermissionTutorial);
