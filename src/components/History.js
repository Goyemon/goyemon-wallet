'use strict';
import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import styled from 'styled-components';
import { RootContainer, HeaderOne, HeaderThree } from '../components/common/';
import Transactions from '../containers/Transactions';
import TransactionsDai from '../containers/TransactionsDai';

export default class History extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: 'All'
    };
  }

  filterTransactions() {
    if (this.state.filter === 'All') {
      return <Transactions />;
    } else if (this.state.filter === 'Dai') {
      return <TransactionsDai />;
    }
  }

  toggleFilterChoiceText() {
    if (this.state.filter === 'All') {
      return (
        <FilterChoiceContainer>
          <FilterChoiceTextSelected>All</FilterChoiceTextSelected>
          <TouchableOpacity
            onPress={() => {
              this.setState({ filter: 'Dai' });
            }}
          >
            <FilterChoiceTextUnelected>Dai</FilterChoiceTextUnelected>
          </TouchableOpacity>
        </FilterChoiceContainer>
      );
    } else if (this.state.filter === 'Dai') {
      return (
        <FilterChoiceContainer>
          <TouchableOpacity
            onPress={() => {
              this.setState({ filter: 'All' });
            }}
          >
            <FilterChoiceTextUnelected>All</FilterChoiceTextUnelected>
          </TouchableOpacity>
          <FilterChoiceTextSelected>Dai</FilterChoiceTextSelected>
        </FilterChoiceContainer>
      );
    }
  }

  render() {
    return (
      <RootContainer>
        <HeaderOne marginTop="64">History</HeaderOne>
        {this.toggleFilterChoiceText()}
        {this.filterTransactions()}
      </RootContainer>
    );
  }
}

const FilterChoiceContainer = styled.TouchableOpacity`
  align-items: center;
  flex-direction: row;
  justify-content: flex-start;
  margin: 0 auto;
  margin-top: 24;
  margin-bottom: 12;
  width: 95%;
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
