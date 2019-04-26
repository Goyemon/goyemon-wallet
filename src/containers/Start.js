'use strict';
import React, { Component } from 'react';
import { View } from 'react-native';
import { Button } from '../components/common/Button';
import { connect } from "react-redux";
import { getMnemonic } from "../actions/ActionMnemonic";

class Start extends Component {
  render() {
    return (
      <View style={styles.textStyle}>
        <Button text="CREATE WALLET" textColor="white" backgroundColor="#01d1e5" onPress={async () => {
          await this.props.getMnemonic();
          this.props.navigation.navigate('ShowMnemonic');
        }} />
        <Button text="Already have a wallet?" textColor="#01d1e5" backgroundColor="white" onPress={() => this.props.navigation.navigate('Import')} />
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
