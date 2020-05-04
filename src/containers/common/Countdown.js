'use strict';
import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import styled from 'styled-components';

class Countdown extends Component {
  constructor(props) {
    super();
    this.state = {
      days: 0,
      hours: 0,
      mins: 0,
      secs: 0
    };
  }

  componentDidMount() {
    this.countdown('05/10/2020 04:00:00 AM');     
    // specify the next end time in pacific time or something
    // get the next end time in user local time
    // get user's current local time
    // calculate
    // repeat. 
  }

  countdown(endDate) {
    endDate = new Date(endDate).getTime();

    if (isNaN(endDate)) {
      return;
    }

    setInterval(() => {
      let days, hours, mins, secs;
      let startDate = new Date().getTime();
      let timeRemaining = parseInt((endDate - startDate) / 1000);

      if (timeRemaining >= 0) {
        days = parseInt(timeRemaining / 86400);
        timeRemaining = timeRemaining % 86400;

        hours = parseInt(timeRemaining / 3600);
        timeRemaining = timeRemaining % 3600;

        mins = parseInt(timeRemaining / 60);
        timeRemaining = timeRemaining % 60;

        secs = parseInt(timeRemaining);

        this.setState({
          days,
          hours,
          mins,
          secs
        });
      } else {
        return;
      }
    }, 1000);
  }

  render() {
    const { days, hours, mins, secs } = this.state;
    return (
      <View>
        <CountdownContainer>
          <CountdownText>{`${parseInt(days, 10)}`}</CountdownText>
          <CountdownText>{`${hours < 10 ? '0' + hours : hours}`}</CountdownText>
          <CountdownText>{`${mins < 10 ? '0' + mins : mins}`}</CountdownText>
          <CountdownText>{`${secs < 10 ? '0' + secs : secs}`}</CountdownText>
        </CountdownContainer>
        <CountdownContainer>
          <CountdownDateText>days</CountdownDateText>
          <CountdownDateText>hours</CountdownDateText>
          <CountdownDateText>mins</CountdownDateText>
          <CountdownDateText>secs</CountdownDateText>
        </CountdownContainer>
      </View>
    );
  }
}

const CountdownContainer = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: center;
`;

const CountdownText = styled.Text`
  color: #000;
  font-family: 'HKGrotesk-Regular';
  font-size: 24;
  margin: 8px 12px;
`;

const CountdownDateText = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  font-size: 16;
  margin: 0 8px;
`;

const mapStateToProps = (state) => ({
  balance: state.ReducerBalance.balance
});

export default withNavigation(connect(mapStateToProps)(Countdown));
