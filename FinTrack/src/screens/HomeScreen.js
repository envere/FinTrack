import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
} from 'react-native'

import MenuButton from '../components/MenuButton'

export default class HomeScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <MenuButton />
        <Text>HomeScreen</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
