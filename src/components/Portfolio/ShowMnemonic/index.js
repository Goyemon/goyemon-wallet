"use strict";
import React, { Component } from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import styled from "styled-components/native";
import { RootContainer, Container, Button, Description } from "../../common";
import PortfolioStack from "../../../navigators/PortfolioStack";
import ShowMnemonicWords from "./ShowMnemonicWords";

class ShowMnemonic extends Component {
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

  render() {
    return (
      <RootContainer>
        <Container
          alignItems="center"
          flexDirection="column"
          justifyContent="center"
          marginTop={96}
          width="90%"
        >
          <Description marginBottom="8" marginLeft="8" marginTop="16">
            carefully save your backup words in order
          </Description>
          <ShowMnemonicWords />
          <Button
            text="Verify Backup Words"
            textColor="#00A3E2"
            backgroundColor="#FFF"
            borderColor="#00A3E2"
            margin="24px auto"
            marginBottom="8px"
            opacity="1"
            onPress={() => this.props.navigation.navigate("VerifyMnemonic")}
          />
        </Container>
      </RootContainer>
    );
  }
}

const BackButtonContainer = styled.TouchableWithoutFeedback`
  align-items: center;
  flex-direction: row;
`;

export default ShowMnemonic;
