'use strict';
import moment from 'moment';
import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import styled from 'styled-components';

class Countdown extends Component {
  constructor(props) {
    super();
    this.state = {
      eventDate: moment
        .duration()
        .add({ days: 7, hours: 0, minutes: 0, seconds: 0 }),
      days: 0,
      hours: 0,
      mins: 0,
      secs: 0
    };
  }

  componentDidMount() {
    this.updateTimer();
  }

  updateTimer = () => {
    const x = setInterval(() => {
      let { eventDate } = this.state;

      if (eventDate <= 0) {
        clearInterval(x);
      } else {
        eventDate = eventDate.subtract(1, 's');
        const days = eventDate.days();
        const hours = eventDate.hours();
        const mins = eventDate.minutes();
        const secs = eventDate.seconds();

        this.setState({
          days,
          hours,
          mins,
          secs,
          eventDate
        });
      }
    }, 1000);
  };

  render() {
    const { days, hours, mins, secs } = this.state;
    return (
      <View>
        <CountdownContainer>
          <CountdownText>{`${days}`}</CountdownText>
          <CountdownText>{`${hours}`}</CountdownText>
          <CountdownText>{`${mins}`}</CountdownText>
          <CountdownText>{`${secs}`}</CountdownText>
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
