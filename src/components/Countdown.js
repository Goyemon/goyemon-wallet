"use strict";
import React, { Component } from "react";
import styled from "styled-components";

class Countdown extends Component {
  constructor() {
    super();
    this.state = {
      remainingDays: 0,
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
      // PoolTogether reveals a winner every Friday 3 p.m. EST which is every Friday at 7 p.m. in UTC

      let timeRemaining = parseInt((targetUTCTime - currentUTCTime) / 1000);

      let remainingDays;
      let targetDay = 5; // Sunday - Saturday : 0 - 6

      if (timeRemaining > 0) {
        remainingDays = targetDay - dateObject.getUTCDay();
      } else {
        remainingDays = targetDay - dateObject.getUTCDay() - 1;
      }
      if (remainingDays < 0) {
        remainingDays += 7;
      }
      if (timeRemaining <= 0) {
        timeRemaining += 86400 * 7;
      }
      this.tick(timeRemaining, remainingDays);
    }, 1000);
  }

  tick(timeRemaining, remainingDays) {
    if (timeRemaining > 0) {
      timeRemaining--;
    } else {
      clearInterval(this.getTimeRemaining());
      this.getTimeRemaining();
    }

    let remainingHours, remainingMins, remainingSecs;
    timeRemaining %= 86400;
    remainingHours = parseInt(timeRemaining / 3600);
    timeRemaining %= 3600;
    remainingMins = parseInt(timeRemaining / 60);
    timeRemaining %= 60;
    remainingSecs = parseInt(timeRemaining);
    this.setState({
      remainingDays,
      remainingHours,
      remainingMins,
      remainingSecs
    });
  }

  render() {
    const {
      remainingDays,
      remainingHours,
      remainingMins,
      remainingSecs
    } = this.state;

    return (
      <CountdownContainer>
        <CountdownInner>
          <CountdownText> {`${remainingDays}`}</CountdownText>
          <CountdownText>{`${
            (remainingHours < 10 ? "0" : "") + remainingHours
          }`}</CountdownText>
          <CountdownText>{`${
            (remainingMins < 10 ? "0" : "") + remainingMins
          }`}</CountdownText>
          <CountdownText>{`${
            (remainingSecs < 10 ? "0" : "") + remainingSecs
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
  margin-bottom: 8px;
`;

const CountdownInner = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: center;
`;
const CountdownText = styled.Text`
  color: #000;
  font-family: "HKGrotesk-Regular";
  font-size: 24;
  margin: 2px 12px;
`;

const CountdownDateText = styled.Text`
  color: #5f5f5f;
  font-family: "HKGrotesk-Regular";
  font-size: 16;
  margin: 0 8px;
`;

export default Countdown;
