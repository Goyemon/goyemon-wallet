"use strict";
import React, { Component } from "react";
import { connect } from "react-redux";
import {
  RootContainer,
  Container,
  ProgressBar,
  Button,
  HeaderTwo,
  Description,
  Loader
} from "../../common";
import FcmPermissions from "../../../firebase/FcmPermissions";
import I18n from "../../../i18n/I18n";
import LogUtilities from "../../../utilities/LogUtilities";

class NotificationPermissionTutorial extends Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      buttonDisabled: false
    };
  }

  notificationPermissionNavigation() {
    const { permissions, navigation } = this.props;
    if (permissions.notification === null) {
      LogUtilities.logInfo("notification permission is not set");
    } else if (permissions.notification === true) {
      navigation.navigate("WalletCreation");
    } else if (permissions.notification === false) {
      navigation.navigate("NotificationPermissionNotGranted");
    }
  }

  render() {
    return (
      <RootContainer>
        <ProgressBar
          oneColor="#FDC800"
          twoColor="#FDC800"
          threeColor="#eeeeee"
          marginRight="40%"
          width="40%"
        />
        <Container
          alignItems="center"
          flexDirection="column"
          justifyContent="center"
          marginTop={40}
          width="90%"
        >
          <HeaderTwo marginBottom="0" marginLeft="0" marginTop="0">
            Enable Notifications
          </HeaderTwo>
          <Description marginBottom="8" marginLeft="0" marginTop="16">
            {I18n.t("notification-tutorial-description")}
          </Description>
          <Button
            text={I18n.t("button-enable")}
            textColor="#00A3E2"
            backgroundColor="#FFF"
            borderColor="#00A3E2"
            disabled={this.state.buttonDisabled}
            margin="16px auto"
            marginBottom="12px"
            opacity="1"
            onPress={async () => {
              this.setState({ loading: true, buttonDisabled: true });
              await FcmPermissions.checkFcmPermissions();
              this.notificationPermissionNavigation();
              this.setState({ loading: false, buttonDisabled: false });
            }}
          />
          <Loader animating={this.state.loading} size="small" />
        </Container>
      </RootContainer>
    );
  }
}

const mapStateToProps = (state) => ({
  permissions: state.ReducerPermissions.permissions
});

export default connect(mapStateToProps)(NotificationPermissionTutorial);
