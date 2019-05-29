import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
} from 'react-native'

import PageHeader from '../components/PageHeader'
import NavigationBar from '../components/NavigationBar'

export default class AccountScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <PageHeader text="Account" navigation={this.props.navigation} />
        <NavigationBar />
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
