import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
} from 'react-native'

export default class TransactionsScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>TransactionsScreen</Text>
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
