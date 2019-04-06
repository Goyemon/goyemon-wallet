'use strict';
import React, { Component } from 'react';
import { View, Button } from 'react-native';
import { connect } from "react-redux";
import { generateMnemonic } from "../actions/ActionMnemonic";

class Start extends Component {
  render() {
    return (
      <View style={styles.textStyle}>
        <Button title="Create Wallet" onPress={async () => {
          await this.props.generateMnemonic();
          this.props.navigation.navigate('ShowMnemonic');
        }} />
        <Button title="Already have a wallet?" onPress={() => this.props.navigation.navigate('Import')} />
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

const mapDispatchToProps = {
    generateMnemonic
}

export default connect(null, mapDispatchToProps)(Start);
