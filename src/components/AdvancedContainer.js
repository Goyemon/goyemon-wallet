"use strict";
import React, { Component } from "react";
import { View, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { connect } from "react-redux";
import styled from "styled-components";
import { getGasPrice, updateGasPriceChosen } from "../actions/ActionGasPrice";
import {
  Container,
  FormHeader,
  GoyemonText,
  MenuContainer,
  ToggleCurrencySymbol
} from "./common";
import SlippageContainer from "./SlippageContainer";
import I18n from "../i18n/I18n";
import LogUtilities from "../utilities/LogUtilities";
import TransactionUtilities from "../utilities/TransactionUtilities.ts";

class __MaxNetworkFeeSelectionContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currency: "USD"
    };
  }

  componentDidMount() {
    this.props.getGasPrice();
  }

  toggleCurrency(gasPriceWEI, gasLimit) {
    if (this.state.currency === "ETH") {
      const usdValue = TransactionUtilities.getMaxNetworkFeeInUSD(
        gasPriceWEI,
        gasLimit
      );
      return <NetworkFeeText>${usdValue}</NetworkFeeText>;
    } else if (this.state.currency === "USD") {
      let ETHValue = TransactionUtilities.getMaxNetworkFeeInETH(
        gasPriceWEI,
        gasLimit
      );
      LogUtilities.logInfo("ETHValue ==>", ETHValue);
      ETHValue = parseFloat(ETHValue).toFixed(5);
      return <NetworkFeeText>{ETHValue}ETH</NetworkFeeText>;
    }
  }

  renderSlippageContainer() {
    if (this.props.swap) {
      return <SlippageContainer />;
    } else {
      LogUtilities.logInfo("this is not the swap component");
    }
  }

  render() {
    const { gasPrice, gasChosen, gasLimit } = this.props;
    const { currency } = this.state;

    return (
      <View>
        {this.renderSlippageContainer()}
        <NetworkFeeHeaderContainer>
          <FormHeader marginBottom="0" marginTop="0">
            {I18n.t("max-network-fee")}
          </FormHeader>
          <TouchableOpacity
            onPress={() => {
              switch (currency) {
                case "ETH":
                  this.setState({ currency: "USD" });
                  break;
                case "USD":
                  this.setState({ currency: "ETH" });
                  break;
              }
            }}
          >
            <ToggleCurrencySymbol currency={currency} />
          </TouchableOpacity>
        </NetworkFeeHeaderContainer>
        <Container
          alignItems="center"
          flexDirection="row"
          justifyContent="center"
          marginTop={24}
          width="90%"
        >
          {gasPrice.map((gasPrice, key) => (
            <NetworkFee key={key}>
              {gasChosen === key ? (
                <SpeedContainer>
                  <SelectedSpeedTextContainer>
                    <SelectedSpeedText>{gasPrice.speed}</SelectedSpeedText>
                  </SelectedSpeedTextContainer>
                  <SelectedButton>
                    {this.toggleCurrency(gasPrice.value, gasLimit)}
                  </SelectedButton>
                  <GoyemonText fontSize={14}>{gasPrice.wait}min</GoyemonText>
                </SpeedContainer>
              ) : (
                <SpeedContainer
                  onPress={() => {
                    this.props.updateGasPriceChosen(key);
                  }}
                >
                  <UnselectedSpeedTextContainer>
                    <UnselectedSpeedText>{gasPrice.speed}</UnselectedSpeedText>
                  </UnselectedSpeedTextContainer>
                  <UnselectedButton>
                    {this.toggleCurrency(gasPrice.value, gasLimit)}
                  </UnselectedButton>
                  <GoyemonText fontSize={14}>{gasPrice.wait}min</GoyemonText>
                </SpeedContainer>
              )}
            </NetworkFee>
          ))}
        </Container>
      </View>
    );
  }
}

class AdvancedContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAdvanced: false
    };
  }

  renderAdvancedContainer() {
    if (this.state.showAdvanced)
      return (
        <>
          <MaxNetworkFeeSelectionContainer
            gasLimit={this.props.gasLimit}
            swap={this.props.swap}
          />
          <MenuContainer
            onPress={() => {
              this.setState({ showAdvanced: false });
            }}
          >
            <Icon name="menu-up" color="#000" size={32} />
          </MenuContainer>
        </>
      );
    else
      return (
        <MenuContainer
          onPress={() => {
            this.setState({ showAdvanced: true });
          }}
        >
          <GoyemonText fontSize={24}>{I18n.t("advanced")}</GoyemonText>
          <Icon name="menu-down" color="#000" size={32} />
        </MenuContainer>
      );
  }

  render() {
    return <View>{this.renderAdvancedContainer()}</View>;
  }
}

const NetworkFeeHeaderContainer = styled.View`
  justify-content: space-between;
  flex-direction: row;
  margin: 0 auto;
  margin-top: 24px;
  width: 90%;
`;

const NetworkFee = styled.View`
  margin: 0 4px;
  margin-bottom: 12px;
  width: 33.3%;
`;

const NetworkFeeText = styled.Text`
  font-family: "HKGrotesk-Regular";
  font-size: 12;
`;

const SpeedContainer = styled.TouchableOpacity`
  align-items: center;
  flex-direction: column;
  justify-content: center;
  margin: 0 6px;
`;

const SelectedSpeedTextContainer = styled.View`
  background-color: #fff;
  border-radius: 16px;
  align-items: center;
  padding: 8px;
  width: 100%;
`;

const UnselectedSpeedTextContainer = styled.View`
  background-color: #fff;
  border-radius: 16px;
  align-items: center;
  padding: 8px;
  width: 100%;
`;

const SelectedSpeedText = styled.Text`
  color: #1ba548;
  font-family: "HKGrotesk-Bold";
  font-size: 16;
`;

const UnselectedSpeedText = styled.Text`
  color: #000;
  font-family: "HKGrotesk-Regular";
  font-size: 16;
`;

const SelectedButton = styled.Text`
  color: #000;
  font-family: "HKGrotesk-Bold";
  margin-top: 8;
`;

const UnselectedButton = styled.Text`
  color: #000;
  font-family: "HKGrotesk-Regular";
  margin-top: 8;
`;

function mapStateToProps(state) {
  return {
    gasPrice: state.ReducerGasPrice.gasPrice,
    gasChosen: state.ReducerGasPrice.gasChosen
  };
}

const mapDispatchToProps = {
  getGasPrice,
  updateGasPriceChosen
};

const MaxNetworkFeeSelectionContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(__MaxNetworkFeeSelectionContainer);

module.exports = {
  MaxNetworkFeeSelectionContainer,
  AdvancedContainer
};
