import React, { Component } from 'react'
import {
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import {
  Container,
  Header,
  Left,
  Body,
  Title,
} from 'native-base'

import DrawerNavigator from './src/navigation/DrawerNavigator'

export default class App extends Component {
  render() {
    return (
      <View style={styles.container}>
        <DrawerNavigator />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
})
