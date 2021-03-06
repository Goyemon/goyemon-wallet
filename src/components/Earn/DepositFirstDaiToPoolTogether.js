"use strict";
import React, { Component } from "react";
import { connect } from "react-redux";
import styled from "styled-components/native";
import { saveOutgoingTransactionDataPoolTogether } from "../../actions/ActionOutgoingTransactionData";
import {
  saveTxConfirmationModalVisibility,
  updateTxConfirmationModalVisibleType
} from "../../actions/ActionModal";
import {
  RootContainer,
  UseMaxButton,
  UntouchableCardContainer,
  HeaderOne,
  Form,
  FormHeader,
  Loader,
  IsOnlineMessage,
  WeiBalanceValidateMessage,
  TxNextButton
} from "../common";
import Countdown from "../Countdown";
import TxConfirmationModal from "../TxConfirmationModal";
import { AdvancedContainer } from "../AdvancedContainer";
import I18n from "../../i18n/I18n";
import {
  RoundDownBigNumberPlacesFour,
  RoundDownBigNumberPlacesEighteen
} from "../../utilities/BigNumberUtilities";
import LogUtilities from "../../utilities/LogUtilities";
import StyleUtilities from "../../utilities/StyleUtilities";
import TransactionUtilities from "../../utilities/TransactionUtilities.ts";
import ABIEncoder from "../../utilities/AbiUtilities";
import { storage } from "../../lib/tx";
import { TxTokenOpTypeToName } from "../../lib/tx/TokenOpType";
import GlobalConfig from "../../config.json";

class DepositFirstDaiToPoolTogether extends Component {
  constructor(props) {
    super(props);
    this.state = {
      DAIBalance: RoundDownBigNumberPlacesFour(props.balance.dai)
        .div(new RoundDownBigNumberPlacesFour(10).pow(18))
        .toFixed(2),
      daiAmount: "",
      DAIAmountValidation: undefined,
      WEIAmountValidation: undefined,
      loading: false
    };
  }

  componentDidMount() {
    this.updateWEIAmountValidation(
      TransactionUtilities.hasSufficientWEIForNetworkFee(
        TransactionUtilities.returnTransactionSpeed(this.props.gasChosen),
        GlobalConfig.ERC20ApproveGasLimit +
          GlobalConfig.PoolTogetherDepositPoolGasLimit
      )
    );
  }

  componentDidUpdate(prevProps) {
    if (this.props.gasChosen != prevProps.gasChosen) {
      this.updateWEIAmountValidation(
        TransactionUtilities.hasSufficientWEIForNetworkFee(
          TransactionUtilities.returnTransactionSpeed(this.props.gasChosen),
          GlobalConfig.ERC20ApproveGasLimit +
            GlobalConfig.PoolTogetherDepositPoolGasLimit
        )
      );
    }
    if (this.props.balance.dai != prevProps.balance.dai) {
      this.setState({
        DAIBalance: RoundDownBigNumberPlacesFour(this.props.balance.dai)
          .div(new RoundDownBigNumberPlacesFour(10).pow(18))
          .toFixed(2)
      });
    }
  }

  async constructDepositPoolTransactionObject() {
    const daiAmount = this.state.daiAmount.split(".").join("");
    const decimalPlaces = TransactionUtilities.decimalPlaces(
      this.state.daiAmount
    );
    const decimals = 18 - parseInt(decimalPlaces);

    const depositPoolEncodedABI = ABIEncoder.encodeDepositPool(
      daiAmount,
      decimals
    );

    const DAIAmountWithDecimals = new RoundDownBigNumberPlacesEighteen(
      this.state.daiAmount
    )
      .times(new RoundDownBigNumberPlacesEighteen(10).pow(18))
      .toString(16);

    const transactionObject = (await storage.newTx())
      .setTo(GlobalConfig.DAIPoolTogetherContractV2)
      .setGasPrice(
        TransactionUtilities.returnTransactionSpeed(
          this.props.gasChosen
        ).toString(16)
      )
      .setGas(GlobalConfig.PoolTogetherDepositPoolGasLimit.toString(16))
      .tempSetData(depositPoolEncodedABI)
      .addTokenOperation("pooltogether", TxTokenOpTypeToName.PTdeposited, [
        storage.getOwnAddress(),
        DAIAmountWithDecimals
      ]);

    return transactionObject.setNonce(transactionObject.getNonce() + 1);
  }

  updateDAIAmountValidation(DAIAmountValidation) {
    if (DAIAmountValidation) {
      this.setState({
        DAIAmountValidation: true
      });
    } else if (!DAIAmountValidation) {
      this.setState({
        DAIAmountValidation: false
      });
    }
  }

  updateWEIAmountValidation(WEIAmountValidation) {
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

  validateForm = async (DAIAmount) => {
    const gasLimit =
      GlobalConfig.ERC20ApproveGasLimit +
      GlobalConfig.PoolTogetherDepositPoolGasLimit;
    const DAIAmountValidation = TransactionUtilities.hasSufficientDAIForPoolTogetherDepositAmount(
      DAIAmount
    );
    const WEIAmountValidation = TransactionUtilities.hasSufficientWEIForNetworkFee(
      TransactionUtilities.returnTransactionSpeed(this.props.gasChosen),
      gasLimit
    );
    const { isOnline } = this.props;

    if (DAIAmountValidation && WEIAmountValidation && isOnline) {
      this.setState({ loading: true });
      LogUtilities.logInfo("validation successful");
      const approveTransactionObject = await TransactionUtilities.constructApproveTransactionObject(
        GlobalConfig.DAIPoolTogetherContractV2,
        this.props.gasChosen
      );
      const depositPoolTransactionObject = await this.constructDepositPoolTransactionObject();
      await this.props.saveOutgoingTransactionDataPoolTogether({
        amount: DAIAmount,
        gasLimit: gasLimit,
        approveTransactionObject: approveTransactionObject,
        transactionObject: depositPoolTransactionObject
      });
      this.props.saveTxConfirmationModalVisibility(true);
      this.props.updateTxConfirmationModalVisibleType("pool-together-approve");
    } else {
      LogUtilities.logInfo("form validation failed!");
    }
  };

  render() {
    const { balance, isOnline } = this.props;
    const { WEIAmountValidation, DAIAmountValidation, loading } = this.state;

    const DAIFullBalance = RoundDownBigNumberPlacesFour(balance.dai)
      .div(new RoundDownBigNumberPlacesFour(10).pow(18))
      .toFixed(0);

    return (
      <RootContainer>
        <TxConfirmationModal />
        <HeaderOne marginTop="96">{I18n.t("deposit")}</HeaderOne>
        <UntouchableCardContainer
          alignItems="center"
          background="#fff"
          borderRadius="8"
          flexDirection="column"
          height="240px"
          justifyContent="center"
          marginTop="56"
          textAlign="center"
          width="90%"
        >
          <CoinImage source={require("../../../assets/dai_icon.png")} />
          <Title>{I18n.t("dai-wallet-balance")}</Title>
          <Value>{this.state.DAIBalance} DAI</Value>
          <Title>until the open round ends</Title>
          <Countdown />
        </UntouchableCardContainer>
        <DepositAmountHeaderContainer>
          <FormHeader marginBottom="0" marginTop="0">
            {I18n.t("deposit-amount")}
          </FormHeader>
          <UseMaxButton
            text={I18n.t("use-max")}
            textColor="#00A3E2"
            onPress={() => {
              this.setState({ daiAmount: DAIFullBalance });
              this.updateDAIAmountValidation(
                TransactionUtilities.hasSufficientDAIForPoolTogetherDepositAmount(
                  DAIFullBalance
                )
              );
            }}
          />
        </DepositAmountHeaderContainer>
        <Form
          borderColor={StyleUtilities.getBorderColor(DAIAmountValidation)}
          borderWidth={1}
          height="56px"
        >
          <SendTextInputContainer>
            <SendTextInput
              placeholder="0"
              keyboardType="numeric"
              clearButtonMode="while-editing"
              onChangeText={(daiAmount) => {
                this.setState({ daiAmount });
                this.updateDAIAmountValidation(
                  TransactionUtilities.hasSufficientDAIForPoolTogetherDepositAmount(
                    daiAmount
                  )
                );
              }}
              returnKeyType="done"
              value={this.state.daiAmount}
            />
            <CurrencySymbolText>DAI</CurrencySymbolText>
          </SendTextInputContainer>
        </Form>
        <AdvancedContainer
          gasLimit={
            GlobalConfig.ERC20ApproveGasLimit +
            GlobalConfig.PoolTogetherDepositPoolGasLimit
          }
        />
        <WeiBalanceValidateMessage weiAmountValidation={WEIAmountValidation} />
        <ButtonWrapper>
          <TxNextButton
            disabled={
              !(DAIAmountValidation && WEIAmountValidation && isOnline) ||
              loading
            }
            opacity={
              DAIAmountValidation && WEIAmountValidation && isOnline ? 1 : 0.5
            }
            onPress={async () => {
              await this.validateForm(this.state.daiAmount);
              this.setState({ loading: false });
            }}
          />
          <Loader animating={loading} size="small" />
        </ButtonWrapper>
        <IsOnlineMessage isOnline={isOnline} />
      </RootContainer>
    );
  }
}

const SendTextInputContainer = styled.View`
  align-items: center;
  flex-direction: row;
  height: 100%;
  width: 95%;
`;

const SendTextInput = styled.TextInput`
  font-size: 16;
  height: 56px;
  width: 95%;
  text-align: left;
`;

const CoinImage = styled.Image`
  border-radius: 20px;
  height: 40px;
  margin-top: 16;
  width: 40px;
`;

const Title = styled.Text`
  color: #5f5f5f;
  font-family: "HKGrotesk-Regular";
  font-size: 16;
  margin-top: 16;
  text-transform: uppercase;
`;

const Value = styled.Text`
  font-family: "HKGrotesk-Regular";
  font-size: 16;
`;

const CurrencySymbolText = styled.Text`
  font-family: "HKGrotesk-Regular";
`;

const DepositAmountHeaderContainer = styled.View`
  justify-content: space-between;
  flex-direction: row;
  margin: 0 auto;
  margin-top: 16px;
  width: 90%;
`;

const ButtonWrapper = styled.View`
  align-items: center;
`;

function mapStateToProps(state) {
  return {
    balance: state.ReducerBalance.balance,
    gasChosen: state.ReducerGasPrice.gasChosen,
    gasPrice: state.ReducerGasPrice.gasPrice,
    isOnline: state.ReducerNetInfo.isOnline
  };
}

const mapDispatchToProps = {
  saveOutgoingTransactionDataPoolTogether,
  saveTxConfirmationModalVisibility,
  updateTxConfirmationModalVisibleType
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DepositFirstDaiToPoolTogether);
