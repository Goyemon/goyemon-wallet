"use strict";
import React, { Component } from "react";
import { BackHandler } from "react-native";
import { connect } from "react-redux";
import { Linking, TouchableHighlight } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import styled from "styled-components/native";
import { clearState } from "../../../actions/ActionClearState";
import { savePopUpModalVisibility } from "../../../actions/ActionModal";
import { rehydrationComplete } from "../../../actions/ActionRehydration";
import {
  RootContainer,
  HeaderOne,
  UntouchableCardContainer,
  Button,
  Description,
  SettingsListCard
} from "../../common";
import PopUpModal from "../../PopUpModal";
import I18n from "../../../i18n/I18n";
import storage from "../../../lib/tx";
import PortfolioStack from "../../../navigators/PortfolioStack";
import { persistor, store } from "../../../store/store";
import LogUtilities from "../../../utilities/LogUtilities";
import WalletUtilities from "../../../utilities/WalletUtilities.ts";

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deleteTextValidation: false
    };
  }

  static navigationOptions = ({ navigation }) => ({
    headerLeft: (
      <BackButtonContainer
        onPress={() => {
          navigation.navigate("PortfolioHome");
          PortfolioStack.navigationOptions = () => {
            const tabBarVisible = true;
            return {
              tabBarVisible
            };
          };
        }}
      >
        <Icon color="#00A3E2" name="chevron-left" size={40} />
      </BackButtonContainer>
    )
  });

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.handleBackButton);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton);
  }

  handleBackButton() {
    PortfolioStack.navigationOptions = () => {
      const tabBarVisible = true;
      return {
        tabBarVisible
      };
    };
  }

  validateDeleteText(deleteText) {
    if (deleteText === "delete") {
      LogUtilities.logInfo("the delete text validated!");
      this.setState({
        deleteTextValidation: true
      });
      return true;
    }
    LogUtilities.logInfo("wrong delete text!");
    this.setState({
      deleteTextValidation: false
    });
    return false;
  }

  render() {
    const { navigation } = this.props;
    return (
      <RootContainer>
        <HeaderOne marginTop="112">{I18n.t("settings-header")}</HeaderOne>
        <PopUpModal
          onPress={() => {
            this.props.savePopUpModalVisibility(false);
            this.setState({
              deleteTextValidation: false
            });
          }}
        >
          <ModalTextContainer>
            <ResetWalletHeader>
              {I18n.t("settings-reset-title")}
            </ResetWalletHeader>
            <Description marginBottom="0" marginLeft="0" marginTop="8">
              {I18n.t("settings-reset-warning")}
            </Description>
          </ModalTextContainer>
          <DeleteTextInputContainer>
            <Description marginBottom="8" marginLeft="0" marginTop="16">
              {I18n.t("settings-reset-instruction")}
            </Description>
            <DeleteTextInput
              autoCapitalize="none"
              clearButtonMode="while-editing"
              onChangeText={(deleteText) => {
                this.validateDeleteText(deleteText);
              }}
            />
          </DeleteTextInputContainer>
          <ButtonContainer>
            <Button
              text={I18n.t("button-cancel")}
              textColor="#5F5F5F"
              backgroundColor="#EEEEEE"
              borderColor="#EEEEEE"
              margin="8px"
              marginBottom="12px"
              opacity="1"
              onPress={() => {
                this.props.savePopUpModalVisibility(false);
                this.setState({
                  deleteTextValidation: false
                });
              }}
            />
            <Button
              text={I18n.t("button-confirm")}
              textColor="#FFF"
              backgroundColor="#E41B13"
              borderColor="#E41B13"
              disabled={this.state.deleteTextValidation ? false : true}
              margin="8px"
              marginBottom="12px"
              opacity={this.state.deleteTextValidation ? 1 : 0.5}
              onPress={async () => {
                await WalletUtilities.resetKeychainData();
                await persistor.purge();
                await storage.clear();
                this.props.clearState();
                // reset notification settings using https://github.com/zo0r/react-native-push-notification
                this.props.savePopUpModalVisibility(false);
                navigation.navigate("Initial");
                store.dispatch(rehydrationComplete(true));
              }}
            />
          </ButtonContainer>
        </PopUpModal>
        <CommunityIconContainer>
          <CommunityIcon>
            <Icon
              onPress={() => {
                Linking.openURL(
                  "https://twitter.com/GoyemonOfficial"
                ).catch((err) =>
                  LogUtilities.logError("An error occurred", err)
                );
              }}
              name="twitter"
              color="#1DA1F2"
              size={40}
            />
          </CommunityIcon>
          <CommunityIcon>
            <Icon
              onPress={() => {
                Linking.openURL("https://github.com/Goyemon").catch((err) =>
                  LogUtilities.logError("An error occurred", err)
                );
              }}
              name="github"
              color="#333"
              size={40}
            />
          </CommunityIcon>
          <CommunityIcon>
            <Icon
              onPress={() => {
                Linking.openURL("https://discord.gg/MXGfnJG").catch((err) =>
                  LogUtilities.logError("An error occurred", err)
                );
              }}
              name="discord"
              color="#7289DA"
              size={40}
            />
          </CommunityIcon>
        </CommunityIconContainer>
        <Description marginBottom="40" marginLeft="8" marginTop="16">
          {I18n.t("settings-community")}
        </Description>
        <SettingsListContainer>
          <SettingsListCard
            iconName="key-outline"
            onPress={() => navigation.navigate("BackupWords")}
          >
            {I18n.t("settings-backup-words")}
          </SettingsListCard>
          <SettingsListCard
            iconName="discord"
            onPress={() => {
              Linking.openURL("https://discord.gg/MXGfnJG").catch((err) =>
                LogUtilities.logError("An error occurred", err)
              );
            }}
          >
            Talk to us
          </SettingsListCard>
          <SettingsListCard
            iconName="wrench-outline"
            onPress={() => navigation.navigate("Advanced")}
          >
            {I18n.t("advanced")}
          </SettingsListCard>
        </SettingsListContainer>
        <UntouchableCardContainer
          alignItems="center"
          borderRadius="0"
          flexDirection="column"
          height="80px"
          justifyContent="center"
          marginTop="40"
          textAlign="center"
          width="100%"
        >
          <TouchableHighlight
            underlayColor="#FFF"
            onPress={() => {
              this.props.savePopUpModalVisibility(true);
            }}
          >
            <ResetWalletText>{I18n.t("settings-reset-wallet")}</ResetWalletText>
          </TouchableHighlight>
        </UntouchableCardContainer>
        <BottomText>
          <VersionText>v0.1.0</VersionText>
          <Icon name="heart-outline" color="#5f5f5f" size={24} />
          <LoveText>Made with love by Swarm</LoveText>
        </BottomText>
      </RootContainer>
    );
  }
}

const BackButtonContainer = styled.TouchableWithoutFeedback`
  align-items: center;
  flex-direction: row;
`;

const ModalTextContainer = styled.View`
  margin: 0 auto;
  width: 90%;
`;

const CommunityIconContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-top: 40;
`;

const CommunityIcon = styled.View`
  margin-left: 8;
  margin-right: 8;
`;

const SettingsListContainer = styled.View`
  background: #fff;
  border-color: rgba(95, 95, 95, 0.3);
  border-top-width: 0.5;
  border-bottom-width: 0.5;
  margin-top: 16;
  margin-bottom: 8;
  width: 100%;
`;

const ResetWalletHeader = styled.Text`
  color: #5f5f5f;
  font-family: "HKGrotesk-Bold";
  font-size: 24;
  text-align: center;
`;

const ResetWalletText = styled.Text`
  color: #e41b13;
  font-family: "HKGrotesk-Regular";
  font-size: 24;
`;

const DeleteTextInputContainer = styled.View`
  align-items: center;
  flex-direction: column;
  margin: 0 auto;
`;

const DeleteTextInput = styled.TextInput`
  background-color: #fff;
  border-color: rgba(95, 95, 95, 0.3);
  border-width: 1;
  font-size: 16;
  padding: 8px 12px;
  text-align: left;
  min-width: 120;
  width: 100%;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  margin: 0 auto;
  margin-top: 16;
  margin-bottom: 16;
`;

const BottomText = styled.View`
  align-items: center;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 24;
`;

const VersionText = styled.Text`
  color: #5f5f5f;
  font-family: "HKGrotesk-Regular";
  margin-bottom: 40;
`;

const LoveText = styled.Text`
  color: #5f5f5f;
  font-family: "HKGrotesk-Regular";
  margin-bottom: 48;
`;

const mapDispatchToProps = {
  clearState,
  savePopUpModalVisibility
};

export default connect(null, mapDispatchToProps)(Settings);
