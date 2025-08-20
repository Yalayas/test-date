import React from 'react';
import { AppRegistry } from 'react-native';
import App from './App';

AppRegistry.registerComponent('DatingApp', () => App);
AppRegistry.runApplication('DatingApp', {
  rootTag: document.getElementById('root')
});

