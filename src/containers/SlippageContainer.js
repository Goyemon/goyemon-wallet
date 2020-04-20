'use strict';
import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { saveSwapSlippage } from '../actions/ActionUniswap';
import { Container, FormHeader } from '../components/common';
import I18n from '../i18n/I18n';

class SlippageContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      slippage: [
        {
          value: 0.1
        },
        {
          label: 'recommended',
          value: 0.5
        },
        {
          value: 1
        }
      ],
      checked: 1
    };
  }

  render() {
    return (
      <View>
        <SlippageHeaderContainer>
          <FormHeader marginBottom="0" marginTop="0">
            {I18n.t('swap-slippage')}
          </FormHeader>
        </SlippageHeaderContainer>
        <Container
          alignItems="center"
          flexDirection="row"
          justifyContent="center"
          marginTop={24}
          width="90%"
        >
          {this.state.slippage.map((slippage, key) => (
            <Slippage key={key}>
              {this.state.checked === key ? (
                <SelectedSlippageTextContainer>
                  <SelectedButton>{slippage.value}%</SelectedButton>
                </SelectedSlippageTextContainer>
              ) : (
                <UnselectedSlippageTextContainer
                  onPress={() => {
                    this.setState({ checked: key });
                    this.props.saveSwapSlippage(
                      this.state.slippage[key].value
                    );
                  }}
                >
                  <UnselectedButton>{slippage.value}%</UnselectedButton>
                </UnselectedSlippageTextContainer>
              )}
            </Slippage>
          ))}
        </Container>
      </View>
    );
  }
}

const SlippageHeaderContainer = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: flex-start;
  margin: 0 auto;
  margin-top: 24;
  width: 90%;
`;

const Slippage = styled.View`
  margin: 8px 4px;
  width: 33.3%;
`;

const SelectedSlippageTextContainer = styled.TouchableOpacity`
  background-color: #fff;
  border-color: #fff;
  border-radius: 16px;
  border-width: 1.5;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  margin: 0 4px;
  padding: 8px 12px;
`;

const UnselectedSlippageTextContainer = styled.TouchableOpacity`
  background-color: #fff;
  border-color: #fff;
  border-radius: 16px;
  border-width: 1;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  margin: 0 4px;
  padding: 8px 12px;
`;

const SelectedButton = styled.Text`
  color: #1ba548;
  font-family: 'HKGrotesk-Bold';
  font-size: 16;
`;

const UnselectedButton = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  font-size: 16;
`;

const mapDispatchToProps = {
  saveSwapSlippage
};

export default connect(null, mapDispatchToProps)(SlippageContainer);
