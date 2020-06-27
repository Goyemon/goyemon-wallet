'use strict';
import React, { Component } from 'react';
import styled from 'styled-components';

class Countdown extends Component {
  constructor(props) {
    super();
    this.state = {
      remainingDay: 0,
      remainingHours: 0,
      remainingMins: 0,
      remainingSecs: 0
    };
  }

  componentDidMount() {
    this.getTimeRemaining();
  }

  getTimeRemaining() {
    setInterval(() => {
      let dateObject = new Date();

      let currentUTCTime = Date.UTC(
        dateObject.getUTCFullYear(),
        dateObject.getUTCMonth(),
        dateObject.getUTCDate(),
        dateObject.getUTCHours(),
        dateObject.getUTCMinutes(),
        dateObject.getUTCSeconds(),
        dateObject.getUTCMilliseconds()
      );
      let targetUTCDate = new Date(
        Date.UTC(
          dateObject.getUTCFullYear(),
          dateObject.getUTCMonth(),
          dateObject.getUTCDate(),
          19,
          0,
          0
        )
      );
      let targetUTCTime = targetUTCDate.getTime();
      let timeRemaining = parseInt((targetUTCTime - currentUTCTime) / 1000);

      let remainingDay;
      let targetDay = 6; // 0 is for Sunday and 6 is for Saturday
      // PoolTogether reveals a winner every Saturday at 7 p.m. in UTC

      if (timeRemaining > 0) {
        remainingDay = targetDay - dateObject.getDay();
      } else {
        remainingDay = targetDay - dateObject.getDay() - 1;
      }
      if (remainingDay < 0) {
        remainingDay += 7;
      }
      if (timeRemaining <= 0) {
        timeRemaining += 86400 * 7;
      }
      this.tick(timeRemaining, remainingDay);
    }, 1000);
  }

  tick(timeRemaining, remainingDay) {
    if (timeRemaining > 0) {
      timeRemaining--;
    } else {
      clearInterval(this.getTimeRemaining());
      this.getTimeRemaining();
    }

    let days, remainingHours, remainingMins, remainingSecs;
    days = parseInt(timeRemaining / 86400);
    timeRemaining %= 86400;
    remainingHours = parseInt(timeRemaining / 3600);
    timeRemaining %= 3600;
    remainingMins = parseInt(timeRemaining / 60);
    timeRemaining %= 60;
    remainingSecs = parseInt(timeRemaining);
    this.setState({
      remainingDay,
      remainingHours,
      remainingMins,
      remainingSecs
    });
  }

  render() {
    const {
      remainingDay,
      remainingHours,
      remainingMins,
      remainingSecs
    } = this.state;
    return (
      <CountdownContainer>
        <CountdownInner>
          <CountdownText> {`${remainingDay}`}</CountdownText>
          <CountdownText>{`${
            (remainingHours < 10 ? '0' : '') + remainingHours
          }`}</CountdownText>
          <CountdownText>{`${
            (remainingMins < 10 ? '0' : '') + remainingMins
          }`}</CountdownText>
          <CountdownText>{`${
            (remainingSecs < 10 ? '0' : '') + remainingSecs
          }`}</CountdownText>
        </CountdownInner>
        <CountdownInner>
          <CountdownDateText>days</CountdownDateText>
          <CountdownDateText>hours</CountdownDateText>
          <CountdownDateText>mins</CountdownDateText>
          <CountdownDateText>secs</CountdownDateText>
        </CountdownInner>
      </CountdownContainer>
    );
  }
}

const CountdownContainer = styled.View`
  margin-top: 8px;
`;

const CountdownInner = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: center;
`;
const CountdownText = styled.Text`
  color: #000;
  font-family: 'HKGrotesk-Regular';
  font-size: 24;
  margin: 2px 12px;
`;

const CountdownDateText = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  font-size: 16;
  margin: 0 8px;
`;

export default Countdown;
