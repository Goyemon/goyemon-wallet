'use strict';
import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';
import { connect } from "react-redux";

class ShowMnemonic extends Component {
  render() {
    const mnemonic = this.props.mnemonic;
    return (
      <View>
        <View style={styles.containerStyle}>
          <Text>This is your mnemonic code.</Text>
          <Text>Keep it somewhere safe and never lose it!</Text>
          <Text style={styles.showMnemonicStyle}>{mnemonic}</Text>
          <Button
            title="I memorized menomic codes!"
            onPress={() => this.props.navigation.navigate('VerifyMnemonic')}
          />
        </View>
      </View>
    );
  }
}


const styles = {
  containerStyle: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  showMnemonicStyle: {
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
    mnemonic: state.ReducerMnemonic.mnemonic,
  };
}

 export default connect(mapStateToProps)(ShowMnemonic);
