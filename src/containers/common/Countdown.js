'use strict';
import moment from 'moment';
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import { RootContainer } from '../../components/common';

class Countdown extends Component {
  constructor(props) {
    super();
    this.state = {
      eventDate: moment
        .duration()
        .add({ days: 7, hours: 3, minutes: 40, seconds: 50 }),
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
      <RootContainer>
        <View>
          <Text>{`${days} : ${hours} : ${mins} : ${secs}`}</Text>
        </View>
      </RootContainer>
    );
  }
}

const mapStateToProps = (state) => ({
  balance: state.ReducerBalance.balance
});

export default withNavigation(connect(mapStateToProps)(Countdown));
