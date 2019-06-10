'use strict';
import React, { Component } from 'react';
import { connect } from "react-redux";
import { getMnemonic } from "../actions/ActionMnemonic";
import styled from 'styled-components';
import { ScrollView, View, Image } from 'react-native';
import { Header } from '../components/common/';

class Start extends Component {
  render() {
    return (
      <ScrollView>
        <Header />
        <Image source={require('../../assets/debank_logo.png')} />
        <Title>a permissionless bank  in your pocket</Title>
        <CardContainer button onPress={async () => {
          await this.props.getMnemonic();
          this.props.navigation.navigate('ShowMnemonic');
        }}>
          <View>
            <CardText>
              Create
            </CardText>
            <CardText>
              new wallet
            </CardText>
          </View>
          <View>
            <CardImage source={require('../../assets/create_wallet_icon.png')}/>
          </View>
        </CardContainer>
        <CardContainer button onPress={() => this.props.navigation.navigate('Import')}>
          <View>
            <CardText>
              Import
            </CardText>
            <CardText>
              existing wallet
            </CardText>
          </View>
          <View>
            <CardImage source={require('../../assets/create_wallet_icon.png')}/>
          </View>
        </CardContainer>
      </ScrollView>
    );
  }
}


const Container = styled.ScrollView.attrs(props => ({
  contentContainerStyle: props => {
    return {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }
  }
}))``

const Title = styled.Text`
  font-size: 32px;
  margin: 16px;
  text-align: center;
`;

const CardContainer = styled.TouchableOpacity`
  width: 160px;
  border-radius: 8px;
  background: #FFF;
  width: 320px;
  height: 200px;
  margin: 24px 16px;
  text-align: center;
  box-shadow: 0 2px 5px rgba(0,0,0,0.3);
  flexDirection: row;
  justifyContent: center;
  alignItems: center;
`;

const CardText = styled.Text`
  font-size: 16px;
  padding: 16px;
  text-align: left;
`;

const CardImage = styled.Image`
  padding: 16px;
`;


const mapDispatchToProps = {
    getMnemonic
}

export default connect(null, mapDispatchToProps)(Start);
