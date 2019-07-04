'use strict';
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import styled from 'styled-components/native';
import { RootContainer, Button, HeaderOne } from '../components/common';

class ShowMnemonic extends Component {
  render() {
    const { mnemonic } = this.props;
    const splitMnemonic = mnemonic.split(' ');

    return (
      <RootContainer>
        <View>
          <HeaderOne>Create Wallet</HeaderOne>
        </View>
        <Container>
          <Text>backup phrases</Text>
          <Text>Please carefully write down these 24 words.</Text>
          <MnemonicPhrasesContainer style={styles.table}>
            {splitMnemonic.map((splitMnemonic, id) => (
              <MnemonicWordWrapper style={styles.cell} key={id}>
                <Text style={styles.text}>{splitMnemonic}</Text>
              </MnemonicWordWrapper>
            ))}
          </MnemonicPhrasesContainer>
          <Text>we will confirm this phrase on the next screen</Text>
          <Button
            text="I’ve written them down"
            textColor="white"
            backgroundColor="#4083FF"
            margin="24px auto"
            onPress={() => this.props.navigation.navigate('VerifyMnemonic')}
          />
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
    flex: 1
  },
  text: {
    fontSize: 16,
    padding: 4,
    textAlign: 'center'
  }
};

const Container = styled.View`
  alignItems: center;
  flexDirection: column;
  justifyContent: center;
`;

const MnemonicPhrasesContainer = styled.View`
  margin-top: 24px;
  margin-bottom: 24px;
  width: 95%;
`;

const MnemonicWordWrapper = styled.View`
  background: #fff;
  border-radius: 16px;
  border-color: #f8f8f8;
  border-width: 4px;
  text-align: center;
`;

function mapStateToProps(state) {
  return {
    mnemonic: state.ReducerMnemonic.mnemonic
  };
}

export default connect(mapStateToProps)(ShowMnemonic);
