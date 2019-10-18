'use strict';
import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { TouchableCardContainer } from '../components/common';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import TransactionUtilities from '../utilities/TransactionUtilities.ts';

class Transaction extends Component {
  renderInOrOutTransactionIcon() {
    if (this.props.transaction.to === null) {
      return (
        <Text>
          <Icon name="call-made" size={16} color="#D0021B" />
        </Text>
      );
    } else if (this.props.web3.utils.toChecksumAddress(this.props.transaction.to) === this.props.checksumAddress) {
      return (
        <Text>
          <Icon name="call-received" size={16} color="#7ED321" />
        </Text>
      );
    } else if (this.props.web3.utils.toChecksumAddress(this.props.transaction.from) === this.props.checksumAddress) {
      return (
        <Text>
          <Icon name="call-made" size={16} color="#D0021B" />
        </Text>
      );
    }
  }

  renderStatus() {
    if (this.props.transaction.state === 'pending') {
      return <Text>pending...</Text>;
    } else if (this.props.transaction.state === 'included') {
      return <Text>included</Text>;
    } else if (this.props.transaction.state === 'confirmed') {
      return <Text>confirmed</Text>;
    }
  }

  renderDirection() {
    if (this.props.transaction.to === null) {
      return <Text>Outgoing</Text>;
    } else if (this.props.web3.utils.toChecksumAddress(this.props.transaction.to) === this.props.checksumAddress) {
      return <Text>Incoming</Text>;
    } else if (this.props.web3.utils.toChecksumAddress(this.props.transaction.from) === this.props.checksumAddress) {
      return <Text>Outgoing</Text>;
    }
  }

  renderPlusOrMinusTransactionIcon() {
    if (this.props.transaction.to === null) {
      return ;
    } else if (this.props.web3.utils.toChecksumAddress(this.props.transaction.to) === this.props.checksumAddress) {
      return <Icon name="plus" size={16} color="#7ED321" />;
    } else if (this.props.web3.utils.toChecksumAddress(this.props.transaction.from) === this.props.checksumAddress) {
      return <Icon name="minus" size={16} color="#D0021B" />;
    }
  }

  renderRoundedValue() {
    const roundedEthValue = parseFloat(this.props.transaction.value).toFixed(4);
    if (this.props.transaction.to === null) {
      return <Text>Contract Creation</Text>;;
    } else if (this.props.web3.utils.toChecksumAddress(this.props.transaction.to) === this.props.checksumAddress) {
      return <Text style={styles.valueStyleGreen}>{roundedEthValue} ETH</Text>;
    } else if (this.props.web3.utils.toChecksumAddress(this.props.transaction.from) === this.props.checksumAddress) {
      return <Text style={styles.valueStyleRed}>{roundedEthValue} ETH</Text>;
    }
  }

  render() {
    let { time } = this.props.transaction;
    time = TransactionUtilities.parseTransactionTime(time);

    return (
      <TouchableCardContainer
        alignItems="center"
        flexDirection="row"
        height="96px"
        justifyContent="center"
        textAlign="left"
        width="95%"
      >
        <TransactionList>
          {this.renderInOrOutTransactionIcon()}
          <View>
            <DirectionText>{this.renderDirection()}</DirectionText>
            <TimeText>{time}</TimeText>
          </View>
          <StatusText>{this.renderStatus()}</StatusText>
          <ValueText>
            {this.renderPlusOrMinusTransactionIcon()}
            <Text>{this.renderRoundedValue()}</Text>
          </ValueText>
        </TransactionList>
      </TouchableCardContainer>
    );
  }
}

const styles = {
  valueStyleRed: {
    color: '#D0021B'
  },
  valueStyleGreen: {
    color: '#7ED321'
  }
};

const TransactionList = styled.View`
  flex: 1;
  flexDirection: row;
  justifyContent: center;
`;

const DirectionText = styled.Text`
  font-size: 16px;
  margin-bottom: 4px;
  margin-left: 16px;
`;

const TimeText = styled.Text`
  color: #5F5F5F;
  margin-left: 16px;
`;

const StatusText = styled.Text`
  font-size: 16px;
  margin-left: 16px;
`;

const ValueText = styled.Text`
  font-size: 16px;
  margin-left: 16px;
`;

const mapStateToProps = state => ({
  checksumAddress: state.ReducerChecksumAddress.checksumAddress,
  web3: state.ReducerWeb3.web3
});

export default connect(mapStateToProps)(Transaction);
