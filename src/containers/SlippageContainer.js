'use strict';
import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { saveOutgoingTransactionDataSwapSlippage } from '../actions/ActionOutgoingTransactionData';
import { Container, FormHeader } from '../components/common';

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
          <FormHeader marginBottom="0" marginLeft="0" marginTop="0">
            Slippage
          </FormHeader>
        </SlippageHeaderContainer>
        <Container
          alignItems="center"
          flexDirection="row"
          justifyContent="center"
          marginTop={24}
          width="80%"
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
                    this.props.saveOutgoingTransactionDataSwapSlippage(
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
  justify-content: center;
  margin-top: 24;
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
  font-family: 'HKGrotesk-Regular';
  font-weight: 500;
`;

const UnselectedButton = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
`;

const mapDispatchToProps = {
  saveOutgoingTransactionDataSwapSlippage
};

export default connect(null, mapDispatchToProps)(SlippageContainer);
