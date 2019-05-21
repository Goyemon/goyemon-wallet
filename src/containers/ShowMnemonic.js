'use strict';
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import styled from 'styled-components/native';
import { Button } from '../components/common';

class ShowMnemonic extends Component {
  render() {
    const { mnemonic } = this.props;
    const splitMnemonic = mnemonic.split(' ');

    return (
      <View style={styles.textStyle}>
        <Text>backup phrases</Text>
        <Text>Please carefully write down these 24 words.</Text>
        <MnemonicPhrasesContainer>
          {splitMnemonic.map((splitMnemonic, id) => (
            <MnemonicWord key={id}>{splitMnemonic} </MnemonicWord>
          ))}
        </MnemonicPhrasesContainer>
        <Text>we will confirm this phrase on the next screen</Text>
        <Button
          text="I’ve written them down"
          textColor="white" backgroundColor="#01d1e5"
          marginTop="24px"
          onPress={() => this.props.navigation.navigate('VerifyMnemonic')}to 
        />
      </View>
    );
  }
}

const styles = {
  textStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
};

const MnemonicPhrasesContainer = styled.Text`
  flexDirection: row;
  justifyContent: center;
  alignItems: center;
`;

const MnemonicWord = styled.Text`
  border-radius: 8px;
  background: #4a90e2;
  margin: 4px;
`;

function mapStateToProps(state) {
  return {
    mnemonic: state.ReducerMnemonic.mnemonic
  };
}

export default connect(mapStateToProps)(ShowMnemonic);
