"use strict";
import React, { Component } from "react";
import { HorizontalLine } from "../common";
import LogUtilities from "../../utilities/LogUtilities";
import SwapBox from "./SwapBox";
import TransactionDetailHeader from "./TransactionDetailHeader";
import PTWithdrawBox from "./PTWithdrawBox";
import NormalBox from "./NormalBox";
import TransactionDetailFooter from "./TransactionDetailFooter";

export default class TransactionDetailContainer extends Component {
  componentDidMount() {
    LogUtilities.toDebugScreen("TDC componentDidMount", this.props.data);
  }

  render() {
    const {
      timestamp,
      status,
      service,
      amount,
      token,
      networkFee,
      hash,
      to,
      from,
      icon,
      option
    } = this.props.data;
    let { method } = this.props.data;
    const { name, size, color } = this.props.data.inOrOut;
    if (service === "PoolTogether" || service === "Uniswap") {
      if (!option && method === "Withdraw") method = "Outgoing";
      if (!option && method === "Swap") method = "Outgoing";
    }

    return (
      <>
        <TransactionDetailHeader
          icon={icon}
          timestamp={timestamp}
          status={status}
          method={method}
        />
        {service === "PoolTogether" && method === "Withdraw" ? (
          <PTWithdrawBox
            name={name}
            size={size}
            color={color}
            option={option}
            token={token}
          />
        ) : service === "Uniswap" ? (
          <SwapBox option={option} />
        ) : name === "" ? null : (
          <NormalBox
            amount={amount}
            name={name}
            size={size}
            color={color}
            token={token}
          />
        )}
        <HorizontalLine borderColor="rgba(95, 95, 95, .2)" />
        <TransactionDetailFooter
          service={service}
          from={from}
          to={to}
          networkFee={networkFee}
          status={status}
          hash={hash}
        />
      </>
    );
  }
}
