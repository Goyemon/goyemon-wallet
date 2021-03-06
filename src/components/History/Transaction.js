"use strict";
import React, { Component } from "react";
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import styled from "styled-components";
import { saveTxDetailModalVisibility } from "../../actions/ActionModal";
import {
  GoyemonText,
  TouchableCardContainer,
  TransactionStatus
} from "../common";
import { storage } from "../../lib/tx";
import EtherUtilities from "../../utilities/EtherUtilities";
import TransactionUtilities from "../../utilities/TransactionUtilities.ts";
import LogUtilities from "../../utilities/LogUtilities";

class Transaction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transaction: null,
      children: <GoyemonText fontSize={12}>...</GoyemonText>
    };
  }

  componentDidMount() {
    storage
      .getTx(
        this.props.transaction.index,
        this.props.transaction.filter || "all"
      )
      .then((x) => {
        if (!x) {
          LogUtilities.toDebugScreen("This is tx has problem", x);
          LogUtilities.toDebugScreen(
            "This is tx has problem",
            this.props.transaction.index
          );
        }
        this.setState({ children: this.computeChildren(x) });
      });
  }

  componentDidUpdate(prevProps) {
    if (this.props.updateCounter !== prevProps.updateCounter)
      storage
        .getTx(
          this.props.transaction.index,
          this.props.transaction.filter || "all"
        )
        .then((x) => {
          this.setState({ children: this.computeChildren(x) });
        });
  }

  computeChildren(tx) {
    let {
      timestamp,
      status,
      service,
      method,
      amount,
      token,
      icon,
      inOrOut,
      option
    } = TransactionUtilities.txCommonObject(
      tx,
      EtherUtilities.getAddressWithout0x(this.props.checksumAddress)
    );
    const { index, filter } = this.props.transaction;
    if (service === "PoolTogether" || service === "Uniswap")
      if ((!option && method === "Withdraw") || (!option && method === "Swap"))
        method = "Outgoing";

    return (
      <TouchableCardContainer
        alignItems="center"
        borderRadius="0"
        flexDirection="row"
        height="80px"
        justifyContent="center"
        marginTop="0"
        textAlign="left"
        width="90%"
        onPress={() => {
          // if (tx.getState() === 0 || tx.getState() === 1) {
          this.props.saveTxDetailModalVisibility(true);
          this.props.onTxTapped(tx, index, filter);
          // } else {
          //   return null;
          // }
        }}
      >
        <TransactionList>
          <InOrOutTransactionContainer>
            <GoyemonText fontSize={16}>
              {icon.name !== "" && (
                <Icon name={icon.name} size={icon.size} color={icon.color} />
              )}
            </GoyemonText>
          </InOrOutTransactionContainer>

          <TypeTimeContainer>
            <Type>
              <GoyemonText
                fontSize={method === "Contract Interaction" ? 14 : 18}
              >
                {method}
              </GoyemonText>
            </Type>
            <Time>{timestamp}</Time>
          </TypeTimeContainer>

          <TransactionStatus
            width="26%"
            txState={method === "Failed" ? null : status}
          />

          <ValueContainer>
            {(inOrOut.name !== "" || inOrOut.color !== "") &&
              method !== "Swap" && (
                <Icon
                  name={inOrOut.name}
                  size={inOrOut.size}
                  color={inOrOut.color}
                />
              )}
            <TransactionAmount
              amount={amount}
              token={token}
              option={option}
              method={method}
            />
          </ValueContainer>
        </TransactionList>
      </TouchableCardContainer>
    );
  }

  render = () => this.state.children;
}

const styles = {
  valueStyleRed: {
    color: "#F1860E"
  },
  valueStyleGreen: {
    color: "#1BA548"
  }
};

const TransactionList = styled.View`
  align-items: center;
  flex: 1;
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
`;

const InOrOutTransactionContainer = styled.View`
  width: 10%;
`;

const TypeTimeContainer = styled.View`
  width: 32%;
`;

const Type = styled.Text`
  font-family: "HKGrotesk-Regular";
  margin-bottom: 4;
`;

const Time = styled.Text`
  color: #5f5f5f;
  font-family: "HKGrotesk-Regular";
`;

const ValueContainer = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: center;
  width: 32%;
`;

const SwapValueContainer = styled.View`
  align-items: center;
  flex-direction: column;
`;

const SwapValueTextContainer = styled.View`
  align-items: center;
  flex-direction: row;
`;

const TransactionAmount = (props) => {
  const { amount, token, option, method } = props;
  switch (method) {
    case "Deposit":
    // falls through
    case "Outgoing":
      return (
        <GoyemonText fontSize={16} style={styles.valueStyleRed}>
          {amount} {token}
        </GoyemonText>
      );
    // falls through
    case "Reward":
    // falls through
    case "Withdraw":
      if (option)
        return (
          <GoyemonText fontSize={16} style={styles.valueStyleGreen}>
            {option.sum} {token}
          </GoyemonText>
        );
    // falls through
    case "Incoming":
      return (
        <GoyemonText fontSize={16} style={styles.valueStyleGreen}>
          {amount} {token}
        </GoyemonText>
      );
    // falls through
    case "Swap":
      return (
        <SwapValueContainer>
          <SwapValueTextContainer>
            <Icon name="minus" size={16} color="#F1860E" />
            <GoyemonText fontSize={16} style={styles.valueStyleGreen}>
              {option.eth} ETH
            </GoyemonText>
          </SwapValueTextContainer>
          <Icon name="swap-vertical" size={16} color="#5f5f5f" />
          <SwapValueTextContainer>
            <Icon name="plus" size={16} color="#1BA548" />
            <GoyemonText fontSize={16} style={styles.valueStyleGreen}>
              {option.dai} DAI
            </GoyemonText>
          </SwapValueTextContainer>
        </SwapValueContainer>
      );
    // falls through
    case "Self":
      return (
        <GoyemonText fontSize={16}>
          {amount} {token}
        </GoyemonText>
      );
    // falls through
    case "Failed":
      return <GoyemonText fontSize={16}></GoyemonText>;
    // falls through
    default:
      return null;
    // falls through
  }
};

const mapDispatchToProps = {
  saveTxDetailModalVisibility
};

export default connect(null, mapDispatchToProps)(Transaction);
