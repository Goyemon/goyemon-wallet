'use strict';
import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';
import { connect } from "react-redux";

class VerifyMnemonic extends Component {
  render() {
    const mnemonic = this.props.mnemonic;
    return (
      <View style={styles.textStyle}>
        <Text style={styles.verifyMnemonicStyle}>{mnemonic}</Text>
        <Text>Did you really keep it safe already?</Text>
        <Text>Do you swear for your mom?</Text>
        <Button
          title="I swear! Get out of here!"
          onPress={() => this.props.navigation.navigate('Wallet')}
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
  },
  verifyMnemonicStyle: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    padding: 8,
    margin: 8
  }
};

function mapStateToProps(state) {
  return {
    mnemonic: state.ReducerMnemonic.mnemonic
  };
}

export default connect(mapStateToProps)(VerifyMnemonic);
