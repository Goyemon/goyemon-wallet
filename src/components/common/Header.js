'use strict';
import React from 'react';
import PropTypes from "prop-types";
import { Text, View } from 'react-native';

const Header = (props) => {
  const { headerStyle, titleTextStyle } = styles;
  return (
    <View style={headerStyle}>
      <Text style={titleTextStyle}>{props.headerText}</Text>
    </View>
  );
};

const styles = {
  headerStyle: {
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
    height: 64,
    paddingTop: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 2,
    position: 'relative'
  },
  titleTextStyle: {
    color: '#000',
    fontSize: 24
  }
};

Header.propTypes = {
  headerText: PropTypes.string
};

export { Header };
