"use strict";
import React, { Component } from "react";
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import styled from "styled-components";
import Web3 from "web3";
import { saveBuyCryptoModalVisibility } from "../../../actions/ActionModal";
import {
  RootContainer,
  UntouchableCardContainer,
  HeaderOne,
  HeaderFour,
  GoyemonText,
  ToggleText,
  ReceiveIcon,
  BuyIcon
} from "../../../components/common";
import BuyCryptoModal from "../../../components/BuyCryptoModal";
import ApplicationBoxes from "./ApplicationBoxes";
import WarningBox from "./WarningBox";
import Copy from "../../Copy";
import FcmPermissions from "../../../firebase/FcmPermissions";
import I18n from "../../../i18n/I18n";
import PortfolioStack from "../../../navigators/PortfolioStack";
import { RoundDownBigNumberPlacesFour } from "../../../utilities/BigNumberUtilities";
import PriceUtilities from "../../../utilities/PriceUtilities";
import { Linking } from "react-native";
import TokenBalanceCards from "../PortfolioWallet/TokenBalanceCards";

class PortfolioHome extends Component {
  constructor() {
    super();
    this.state = {
      toggle: true
    };
  }
  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: (
        <Icon
          color="#5f5f5f"
          name="cog-outline"
          size={28}
          onPress={() => {
            PortfolioStack.navigationOptions = () => {
              const tabBarVisible = false;
              return {
                tabBarVisible
              };
            };
            navigation.navigate("Settings");
          }}
        />
      )
    };
  };

  async componentDidMount() {
    PortfolioStack.navigationOptions = () => {
      const tabBarVisible = true;
      return {
        tabBarVisible
      };
    };
    await FcmPermissions.checkFcmPermissions();
  }

  returnBalance = (amount, round, pow, fix) =>
    RoundDownBigNumberPlacesFour(amount)
      .div(new RoundDownBigNumberPlacesFour(round).pow(pow))
      .toFixed(fix);

  render() {
    const {
      balance,
      navigation,
      checksumAddress,
      mnemonicWordsValidation,
      price
    } = this.props;
    const { toggle } = this.state;

    const ETHBalance = RoundDownBigNumberPlacesFour(
        Web3.utils.fromWei(balance.wei)
      ).toFixed(4),
      DAIBalance = this.returnBalance(balance.dai, 10, 18, 2),
      CDAIBalance = this.returnBalance(balance.cDai, 10, 8, 2),
      PLDAIBalance = this.returnBalance(
        balance.pooltogetherDai.committed,
        10,
        18,
        0
      );

    const poolTogetherDAIBalance = RoundDownBigNumberPlacesFour(
      balance.pooltogetherDai.open
    )
      .plus(balance.pooltogetherDai.committed)
      .plus(balance.pooltogetherDai.sponsored)
      .div(new RoundDownBigNumberPlacesFour(10).pow(18))
      .toFixed(2);

    const totalBalance = parseFloat(
      PriceUtilities.getTotalWalletBalance(
        ETHBalance,
        DAIBalance,
        CDAIBalance,
        PLDAIBalance
      )
    );

    const applicationBoxes = [
      {
        balance: PriceUtilities.convertCDAIToUSD(CDAIBalance).toFixed(2),
        name: "Compound",
        event: () => navigation.navigate("PortfolioCompound")
      },
      {
        balance: PriceUtilities.convertDAIToUSD(poolTogetherDAIBalance).toFixed(
          2
        ),
        name: "PoolTogether",
        event: () => navigation.navigate("PortfolioPoolTogether")
      }
    ];

    const tokenBalanceCards = [
      {
        price: price.eth,
        balance: ETHBalance,
        usd: PriceUtilities.convertETHToUSD(ETHBalance).toFixed(2),
        icon: require("../../../../assets/ether_icon.png"),
        token: "ETH"
      },
      {
        price: price.dai,
        balance: DAIBalance,
        usd: PriceUtilities.convertDAIToUSD(DAIBalance).toFixed(2),
        icon: require("../../../../assets/dai_icon.png"),
        token: "DAI"
      },
      {
        price: parseFloat(price.cdai).toFixed(2),
        balance: CDAIBalance,
        usd: PriceUtilities.convertCDAIToUSD(CDAIBalance).toFixed(2),
        icon: require("../../../../assets/cdai_icon.png"),
        token: "cDAI"
      },
      {
        price: price.dai,
        balance: PLDAIBalance,
        usd: PriceUtilities.convertDAIToUSD(PLDAIBalance).toFixed(2),
        icon: require("../../../../assets/pldai_icon.png"),
        token: "plDAI"
      }
    ];

    let truncatedAdderss;
    if (checksumAddress)
      truncatedAdderss = checksumAddress.substring(0, 24) + "...";

    return (
      <RootContainer>
        <HeaderOne marginTop="64">{I18n.t("portfolio")}</HeaderOne>
        <BuyCryptoModal />
        <UntouchableCardContainer
          alignItems="center"
          background="#fff"
          borderRadius="8"
          flexDirection="column"
          height="240px"
          justifyContent="center"
          marginTop="24px"
          textAlign="center"
          width="90%"
        >
          <HeaderFour marginTop="0">
            {I18n.t("portfolio-home-totalbalance")}
          </HeaderFour>
          <UsdBalance>${totalBalance.toFixed(2)}</UsdBalance>
          <GoyemonText fontSize={16}>{truncatedAdderss}</GoyemonText>
          <IconContainer>
            <ReceiveIconContainer>
              <ReceiveIcon
                onPress={() => {
                  navigation.navigate("Receive");
                }}
              />
              <GoyemonText fontSize={14}>Receive</GoyemonText>
            </ReceiveIconContainer>
            <Copy text={checksumAddress} animation={true} icon={true} />
            <BuyIconContainer>
              <BuyIcon
                onPress={() => {
                  // this.props.saveBuyCryptoModalVisibility(true);
                  Linking.openURL(
                    "https://buy-staging.moonpay.io?apiKey=pk_test_5rrKC6JCcKWROpZmcPtuoYaFoUnw2fLs&colorCode=%2300A3E2"
                  );
                }}
              />
              <GoyemonText fontSize={14}>Buy</GoyemonText>
            </BuyIconContainer>
          </IconContainer>
        </UntouchableCardContainer>
        {!mnemonicWordsValidation && (
          <WarningBox
            onPress={() => {
              this.props.navigation.navigate("ShowMnemonic");
              PortfolioStack.navigationOptions = () => {
                const tabBarVisible = false;
                return {
                  tabBarVisible
                };
              };
            }}
          />
        )}
        <TabChangeBox>
          <TabChangeButton>
            <ToggleText
              fontSize={18}
              onPress={() => this.setState({ toggle: true })}
              isSelected={toggle}
              text="SAVINGS"
            />
          </TabChangeButton>
          <TabChangeButton>
            <ToggleText
              fontSize={18}
              onPress={() => this.setState({ toggle: false })}
              isSelected={!toggle}
              text="CURRENCY"
            />
          </TabChangeButton>
        </TabChangeBox>
        {toggle ? (
          <ApplicationBoxes boxes={applicationBoxes} />
        ) : (
          <TokenBalanceCards cards={tokenBalanceCards} />
        )}
      </RootContainer>
    );
  }
}

const TabChangeBox = styled.View`
  flex-direction: row;
  width: 60%;
  margin-right: auto;
  margin-left: auto;
  padding-bottom: 10px;
`;

const TabChangeButton = styled.View`
  width: 50%;
`;

const UsdBalance = styled.Text`
  color: #000;
  font-family: "HKGrotesk-Regular";
  font-size: 32;
  margin-bottom: 12px;
`;

const IconContainer = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: space-around;
  width: 60%;
`;

const ReceiveIconContainer = styled.View`
  align-items: center;
  flex-direction: column;
  margin-top: 16;
  width: 33.3%;
`;

const BuyIconContainer = styled.View`
  align-items: center;
  flex-direction: column;
  margin-top: 16;
  width: 33.3%;
`;

const mapStateToProps = (state) => ({
  mnemonicWordsValidation:
    state.ReducerMnemonicWordsValidation.mnemonicWordsValidation,
  balance: state.ReducerBalance.balance,
  checksumAddress: state.ReducerChecksumAddress.checksumAddress,
  price: state.ReducerPrice.price
});

const mapDispatchToProps = {
  saveBuyCryptoModalVisibility
};

export default connect(mapStateToProps, mapDispatchToProps)(PortfolioHome);
