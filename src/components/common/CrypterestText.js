'use strict';
import React from 'react';
import styled from 'styled-components/native';

const CrypterestText = props => <HKGroteskText>{props.children}</HKGroteskText>;

const HKGroteskText = styled.Text`
  font-family: 'HKGrotesk-Regular';
`;

export { CrypterestText };
