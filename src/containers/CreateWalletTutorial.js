'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components/native';
import { saveMnemonicWords } from '../actions/ActionMnemonic';
import { RootContainer, Button, HeaderTwo, Description, Loader } from '../components/common';
import WalletUtilities from '../utilities/WalletUtilities.ts';

class CreateWalletTutorial extends Component {
  constructor(props) {
    super();
    this.state = {
      loading: false,
      buttonDisabled: false,
      navigationDestination: ''
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.mnemonicWords != null && this.props.mnemonicWords != prevProps.mnemonicWords) {
      this.setState({ loading: false, buttonDisabled: false });
      this.navigateToNext();
    }
  }

  navigateToNext() {
    if (this.state.navigationDestination === 'ShowMnemonic') {
      this.props.navigation.navigate('ShowMnemonic');
    } else if (this.state.navigationDestination === 'MnemonicWordsScreenshot') {
      this.props.navigation.navigate('MnemonicWordsScreenshot');
    }
  }

  render() {
    return (
      <RootContainer>
        <Container>
          <HeaderTwo marginBottom="24" marginLeft="0" marginTop="144">
            With Great Power Comes Great Responsibility
          </HeaderTwo>
          <Description marginBottom="8" marginLeft="0" marginTop="16">
            - backup words are the only way to restore your wallet
          </Description>
          <Description marginBottom="16" marginLeft="0" marginTop="0">
            - only you have access to them. We do NOT.
          </Description>
          <Button
            text="Verify Backup Words"
            textColor="#00A3E2"
            backgroundColor="#FFF"
            borderColor="#00A3E2"
            disabled={this.state.buttonDisabled}
            margin="24px auto"
            marginBottom="12px"
            opacity="1"
            onPress={async () => {
              this.setState({
                loading: true,
                buttonDisabled: true,
                navigationDestination: 'ShowMnemonic'
              });
              await WalletUtilities.init();
              await this.props.saveMnemonicWords();
            }}
          />
          <Button
            text="Take a Screenshot"
            textColor="#00A3E2"
            backgroundColor="#F8F8F8"
            borderColor="#F8F8F8"
            disabled={this.state.buttonDisabled}
            margin="0 auto"
            marginBottom="12px"
            opacity="1"
            onPress={async () => {
              this.setState({
                loading: true,
                buttonDisabled: true,
                navigationDestination: 'MnemonicWordsScreenshot'
              });
              await WalletUtilities.init();
              await this.props.saveMnemonicWords();
            }}
          />
          <Loader animating={this.state.loading} />
        </Container>
      </RootContainer>
    );
  }
}

const Container = styled.View`
  align-items: center;
  flex-direction: column;
  justify-content: center;
  margin: 0 auto;
  width: 90%;
`;

function mapStateToProps(state) {
  return {
    mnemonicWords: state.ReducerMnemonic.mnemonicWords
  };
}

const mapDispatchToProps = {
  saveMnemonicWords
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateWalletTutorial);
