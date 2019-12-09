'use strict';
import React, { Component } from 'react';
import { View, TextInput } from 'react-native';
import { connect } from 'react-redux';
import styled from 'styled-components/native';
import { RootContainer, ProgressBar, HeaderTwo, Button, Description } from '../components/common';
import WalletUtilities from '../utilities/WalletUtilities.ts';
import { saveMnemonic } from '../actions/ActionMnemonic';

class ImportTwentyFourMnemonicWords extends Component {
  constructor() {
    super();
    this.state = {
      mnemonicWords: [
        'globe',
        'left',
        'other',
        'tongue',
        'fox',
        'wolf',
        'bless',
        'snap',
        'lecture',
        'scheme',
        'mobile',
        'inflict',
        'chicken',
        'poem',
        'attend',
        'school',
        'october',
        'cereal',
        'soldier',
        'ability',
        'fly',
        'rescue',
        'wagon',
        'wise'
      ],
      mnemonicWordsValidation: true
    };
  }

  async validateForm() {
    const mnemonicWords = this.state.mnemonicWords.join(" ");
    if (WalletUtilities.validateMnemonic(mnemonicWords)) {
      this.setState({mnemonicWordsValidation: true});
      await WalletUtilities.setMnemonic(mnemonicWords);
      await this.props.saveMnemonic();
      this.props.navigation.navigate('NotificationPermissionTutorial');
    } else {
      this.setState({mnemonicWordsValidation: false});
      console.log('form validation failed!');
    }
  }

  renderInvalidMnemonicWordsMessage() {
    if (this.state.mnemonicWordsValidation) {
      return ;
    } else {
      return <ErrorMessage>invalid mnemonic words!</ErrorMessage>
    }
  }

  handleTextChange = (text, id) => {
    const mnemonicWords = this.state.mnemonicWords;
    mnemonicWords[id] = text;

    this.setState({ mnemonicWords });
  };

  render() {
    return (
      <RootContainer>
        <ProgressBar oneColor="#FDC800" twoColor="#FDC800" threeColor="#eeeeee" marginRight="40%" width="40%" />
        <Container>
          <HeaderTwo marginBottom="16" marginLeft="0" marginTop="24">
            Import Backup Words
          </HeaderTwo>
          <Description marginBottom="8" marginLeft="8" marginTop="16">
          Enter the backup words to import your wallet.
          </Description>
          <MnemonicWordsContainer style={styles.table}>
            {this.state.mnemonicWords.map((word, id) => (
              <View style={styles.cell} key={id}>
                <MnemonicWordWrapper>
                  <TextInput
                    style={{ textAlign: 'center', padding: 4 }}
                    placeholder={(id + 1).toString()}
                    autoCapitalize="none"
                    maxLength={15}
                    onChangeText={text => {
                      this.handleTextChange(text, id);
                    }}
                  />
                </MnemonicWordWrapper>
              </View>
            ))}
          </MnemonicWordsContainer>
          <ButtonContainer>
            <Button
              text="Next"
              textColor="#00A3E2"
              backgroundColor="#FFF"
              borderColor="#00A3E2"
              margin="24px auto"
              opacity="1"
              onPress={async () => {
                await this.validateForm();
              }}
            />
          </ButtonContainer>
          <View>
            {this.renderInvalidMnemonicWordsMessage()}
          </View>
        </Container>
      </RootContainer>
    );
  }
}

const styles = {
  table: {
    flexWrap: 'wrap',
    flexDirection: 'row'
  },
  cell: {
    flexBasis: '25%',
    flex: 1,
    marginBottom: 8
  }
};

const Container = styled.View`
  alignItems: center;
  flexDirection: column;
  justifyContent: center;
`;

const MnemonicWordsContainer = styled.View`
  margin-bottom: 24px;
  margin-top: 24px;
  width: 95%;
`;

const MnemonicWordWrapper = styled.View`
  background: #fff;
  border-color: #f8f8f8;
  border-radius: 16px;
  border-width: 4px;
  text-align: center;
`;

const ButtonContainer = styled.View`
  alignItems: center;
  flexDirection: row;
  justifyContent: center;
`;

const ErrorMessage = styled.Text`
  color: #E41B13;
  font-family: 'HKGrotesk-Regular';
`;

const mapDispatchToProps = {
  saveMnemonic
};

export default connect(
  null,
  mapDispatchToProps
)(ImportTwentyFourMnemonicWords);
