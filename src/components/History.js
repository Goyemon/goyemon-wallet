'use strict';
import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import styled from 'styled-components';
import { RootContainer, HeaderOne, HeaderThree } from '../components/common/';
// TODO: git rm those two:
//import Transactions from '../containers/Transactions';
//import TransactionsDai from '../containers/TransactionsDai';
import TransactionList from '../containers/TransactionList';

export default class History extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: 'All'
    };
  }


  toggleFilterChoiceText() {
    const choices = ['All', 'Dai'].map(filter => {
        if (filter == this.state.filter)
          return <FilterChoiceTextSelected>{filter}</FilterChoiceTextSelected>;

        return  <TouchableOpacity onPress={() => this.setState({ filter: filter })}>
                  <FilterChoiceTextUnelected>{filter}</FilterChoiceTextUnelected>
                </TouchableOpacity>;
    });

    return <FilterChoiceContainer>{choices}</FilterChoiceContainer>;
  }

  render() {
    return (
      <RootContainer>
        <HeaderOne marginTop="64">History</HeaderOne>
        {this.toggleFilterChoiceText()}
        <TransactionList tokenFilter={this.state.filter} key={`TransactionList_${this.state.filter}`} />
      </RootContainer>
    );
  }
}

const FilterChoiceContainer = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: flex-start;
  margin-top: 24;
  margin-bottom: 12;
  margin-left: 16;
`;

const FilterChoiceTextSelected = styled.Text`
  color: #000;
  font-size: 24;
  font-weight: bold;
  margin-right: 12;
  text-transform: uppercase;
`;

const FilterChoiceTextUnelected = styled.Text`
  font-size: 24;
  font-weight: bold;
  margin-right: 12;
  opacity: 0.4;
  text-transform: uppercase;
`;
