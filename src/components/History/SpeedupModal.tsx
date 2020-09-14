import React, { Component } from "react";
import Slider from "@react-native-community/slider";
import { HeaderTwo, GoyemonText, WeiBalanceValidateMessage } from "../common";
import { connect } from "react-redux";
import styled from "styled-components/native";
import TransactionUtilities from "../../utilities/TransactionUtilities";

interface AppProps {
  currentGasPrice: any;
  gasPrice: any;
  gasLimit: any;
  updateWeiAmountValidationInModal: () => void;
  onSettle: any;
}

interface AppState {
  maxPrice?: any;
  WEIAmountValidation?: any;
  usdValue?: any;
  ethValue?: any;
}

const mapGasPriceStateToProps = (state: any) => ({
  gasPrice: state.ReducerGasPrice.gasPrice
});

const MagicalGasPriceSlider = connect(mapGasPriceStateToProps)(
  class MagicalGasPriceSlider extends Component<AppProps, AppState> {
    constructor(props: AppProps) {
      super(props);
      this.state = {
        WEIAmountValidation: undefined,
        maxPrice: ""
      };
      this.state = this.getPriceState(
        Math.ceil(this.props.currentGasPrice * 1.2)
      );
      props.gasPrice.forEach((x: any) => {
        if (x.speed == "super fast")
          this.setState({ maxPrice: Math.ceil(x.value * 1.2) });
      });
    }

    getPriceState(gasPriceWeiDecimal: any) {
      return {
        usdValue: TransactionUtilities.getMaxNetworkFeeInUSD(
          gasPriceWeiDecimal,
          this.props.gasLimit
        ),
        ethValue: parseFloat(
          TransactionUtilities.getMaxNetworkFeeInETH(
            gasPriceWeiDecimal,
            this.props.gasLimit
          )
        ).toFixed(5)
      };
    }

    sliderValueChange(gasPriceWeiDecimal: any) {
      gasPriceWeiDecimal = Math.floor(gasPriceWeiDecimal);
      this.setState(this.getPriceState(gasPriceWeiDecimal));
    }

    updateWeiAmountValidation(WEIAmountValidation: any) {
      this.props.updateWeiAmountValidationInModal();
      if (WEIAmountValidation) {
        this.setState({
          WEIAmountValidation: true
        });
      } else if (!WEIAmountValidation) {
        this.setState({
          WEIAmountValidation: false
        });
      }
    }

    render() {
      //<GoyemonText fontSize={12}>{JSON.stringify(this.props.gasPrice)} -- {JSON.stringify(this.props.currentGas)}</GoyemonText>;
      const minimumGasPrice = Math.ceil(this.props.currentGasPrice * 1.2);

      return (
        <>
          <HeaderTwo marginBottom="0" marginLeft="0" marginTop="24">
            Choose a new max network fee
          </HeaderTwo>
          <Explanation>
            <GoyemonText fontSize={12}>
              *you can speed up your transaction by changing the limit
            </GoyemonText>
          </Explanation>
          <Slider
            value={minimumGasPrice}
            minimumValue={minimumGasPrice}
            maximumValue={this.state.maxPrice}
            onValueChange={(gasPriceWeiDecimal) => {
              this.updateWeiAmountValidation(
                TransactionUtilities.hasSufficientWEIForNetworkFee(
                  gasPriceWeiDecimal,
                  this.props.gasLimit
                )
              );
              this.sliderValueChange(gasPriceWeiDecimal);
            }}
            onSlidingComplete={this.props.onSettle}
            minimumTrackTintColor="#00A3E2"
            style={{
              width: "90%",
              marginLeft: "auto",
              marginRight: "auto",
              marginTop: 32,
              marginBottom: 16
            }}
          />
          <WeiBalanceValidateMessage
            weiAmountValidation={this.state.WEIAmountValidation}
          />
          <NetworkFeeContainer>
            <GoyemonText fontSize={20}>{this.state.ethValue} ETH</GoyemonText>
            <GoyemonText fontSize={20}>{this.state.usdValue} USD</GoyemonText>
          </NetworkFeeContainer>
        </>
      );
    }
  }
);

const NetworkFeeContainer = styled.View`
  align-items: center;
  margin-bottom: 16;
`;

const Explanation = styled.View`
  align-items: center;
`;

export default MagicalGasPriceSlider;
