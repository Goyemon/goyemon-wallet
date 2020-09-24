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
  NewHeaderThree,
  HeaderFour,
  GoyemonText,
  ReceiveIcon,
  BuyIcon
} from "../../../components/common";
import BuyCryptoModal from "../../../components/BuyCryptoModal";
import ApplicationBoxes from "./ApplicationBoxes";
import Copy from "../../Copy";
import FcmPermissions from "../../../firebase/FcmPermissions";
import I18n from "../../../i18n/I18n";
import PortfolioStack from "../../../navigators/PortfolioStack";
import { RoundDownBigNumberPlacesFour } from "../../../utilities/BigNumberUtilities";
import PriceUtilities from "../../../utilities/PriceUtilities";
import { View, Text, Modal } from "react-native";

class PortfolioHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModal: true
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
    const { balance, navigation, checksumAddress } = this.props;
    const { isModal } = this.state;

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
        balance: PriceUtilities.getTotalWalletBalance(
          ETHBalance,
          DAIBalance,
          CDAIBalance,
          PLDAIBalance
        ),
        name: I18n.t("portfolio-home-wallet"),
        event: () => navigation.navigate("PortfolioWallet")
      },
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

    let truncatedAdderss;
    if (checksumAddress)
      truncatedAdderss = checksumAddress.substring(0, 24) + "...";

    return (
      <RootContainer>
        <Modal transparent={true} visible={isModal}>
          <View style={{ backgroundColor: "#000000aa", flex: 1 }}>
            <View
              style={{
                backgroundColor: "#ffffff",
                marginLeft: 40,
                marginRight: 40,
                marginTop: 250,
                borderRadius: 10,
                flex: 0,
                witdh: 300,
                height: 300,
                opacity: 0.8
              }}
            >
              <TextContainer
                style={{ borderBottomColor: "#f4f4f4", borderBottomWidth: 1 }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    textAlign: "center",
                    paddingBottom: 5,
                    paddingLeft: 40,
                    paddingRight: 40,
                    paddingTop: 20
                  }}
                >
                  Backup your wallet, keep your assets safe
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    paddingBottom: 15,
                    paddingLeft: 20,
                    paddingRight: 20
                  }}
                >
                  With no backup, losing your device will result in the loss of
                  access forever. \nIn some extremely rare cases, hardware
                  issues with iOS devices have resulted in corrupted keys, which
                  lead to permanent loss of access too.
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    paddingLeft: 20,
                    paddingRight: 20,
                    paddingBottom: 25
                  }}
                >
                  The only way to guard against losses is to back up your wallet
                </Text>
              </TextContainer>
              <ButtonContainer style={{ fontSize: 25 }}>
                <ChoiceContainer
                  style={{ borderRightColor: "#f4f4f4", borderRightWidth: 1 }}
                >
                  <Text
                    style={{
                      fontSize: 24,
                      textAlign: "center",
                      borderRightColor: "#f4f4f4",
                      borderBottomWidth: 1,
                      color: "#ff4500"
                    }}
                    onPress={() => this.setState({ isModal: false })}
                  >
                    I will risk it
                  </Text>
                </ChoiceContainer>
                <ChoiceContainer>
                  <Text
                    style={{
                      fontSize: 24,
                      textAlign: "center",
                      color: "#4682b4"
                    }}
                  >
                    Backup now
                  </Text>
                </ChoiceContainer>
              </ButtonContainer>
            </View>
          </View>
        </Modal>

        <HeaderOne marginTop="64">{I18n.t("portfolio")}</HeaderOne>
        <BuyCryptoModal />
        <UntouchableCardContainer
          alignItems="center"
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
                  this.props.saveBuyCryptoModalVisibility(true);
                }}
              />
              <GoyemonText fontSize={14}>Buy</GoyemonText>
            </BuyIconContainer>
          </IconContainer>
        </UntouchableCardContainer>
        <NewHeaderThree
          color="#000"
          marginBottom="0"
          marginLeft="24"
          marginTop="0"
          text={I18n.t("portfolio-home-applications")}
        />
        <ApplicationBoxes boxes={applicationBoxes} />
      </RootContainer>
    );
  }
}

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

const ButtonContainer = styled.View`
  flex-direction: row;
`;

const TextContainer = styled.View`
  width: 100%;
`;

const ChoiceContainer = styled.View`
  width: 50%;
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
  balance: state.ReducerBalance.balance,
  checksumAddress: state.ReducerChecksumAddress.checksumAddress,
  price: state.ReducerPrice.price
});

const mapDispatchToProps = {
  saveBuyCryptoModalVisibility
};

export default connect(mapStateToProps, mapDispatchToProps)(PortfolioHome);
