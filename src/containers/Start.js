'use strict';
import React, { Component } from 'react';
import { View, Button } from 'react-native';
import { connect } from "react-redux";
import { getMnemonic } from "../actions/ActionMnemonic";

class Start extends Component {
  render() {
    return (
      <View style={styles.textStyle}>
        <Button title='CREATE WALLET' onPress={async () => {
          await this.props.getMnemonic();
          this.props.navigation.navigate('ShowMnemonic');
        }} />
        <Button title='Already have a wallet?' onPress={() => this.props.navigation.navigate('Import')} />
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
    getMnemonic
}

export default connect(null, mapDispatchToProps)(Start);
