import React, { Component } from 'react'
import { StyleSheet, Button } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

export default class SettingsButton extends Component {
  render() {
    return(
      <Icon 
        name='md-settings'
        color='white'
        size={35}
        style={styles.settingsButton}
        onPress={() => {this.props.navigation.navigate('Settings')}}
      />
    )
  }
}

const styles = StyleSheet.create({
  settingsButton: {

  },
})