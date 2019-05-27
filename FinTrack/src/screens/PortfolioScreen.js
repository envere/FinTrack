import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
} from 'react-native'

export default class PortfolioScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>PortfolioScreen</Text>
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
