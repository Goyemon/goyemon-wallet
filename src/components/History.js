'use strict';
import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import styled from 'styled-components';
import { HeaderOne } from '../components/common/';
// TODO: git rm those two:
//import Transactions from '../containers/Transactions';
//import TransactionsDai from '../containers/TransactionsDai';
import OfflineNotice from '../containers/OfflineNotice';
import TransactionList from '../containers/TransactionList';
import I18n from '../i18n/I18n';

export default class History extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: 'All'
    };
  }

  toggleFilterChoiceText() {
    const choices = ['All', 'Dai'].map((filter) => {
      if (filter == this.state.filter)
        return (
          <FilterChoiceTextSelected key={filter}>
            {filter}
          </FilterChoiceTextSelected>
        );

      return (
        <TouchableOpacity
          key={filter}
          onPress={() => this.setState({ filter: filter })}
        >
          <FilterChoiceTextUnselected>{filter}</FilterChoiceTextUnselected>
        </TouchableOpacity>
      );
    });

    return <FilterChoiceContainer>{choices}</FilterChoiceContainer>;
  }

  render() {
    return (
      <HistoryContainer>
        <OfflineNotice />
        <HeaderOne marginTop="64">{I18n.t('history')}</HeaderOne>
        {this.toggleFilterChoiceText()}
        <TransactionList
          tokenFilter={this.state.filter}
          key={`TransactionList_${this.state.filter}`}
        />
      </HistoryContainer>
    );
  }
}

const HistoryContainer = styled.View`
  background: #f8f8f8;
  height: 100%;
`;

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

const FilterChoiceTextUnselected = styled.Text`
  font-size: 24;
  font-weight: bold;
  margin-right: 12;
  opacity: 0.4;
  text-transform: uppercase;
`;
