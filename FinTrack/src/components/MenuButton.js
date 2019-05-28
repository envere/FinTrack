import React, { Component } from 'react'
import { StyleSheet, Button } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

export default class MenuButton extends Component {
  render() {
    return(
      <Icon 
        name="md-menu"
        color="white"
        size={35} 
        style={ style.menuButton } 
        onPress={() => {this.props.navigation.toggleDrawer()}}
      />
    )
  }
}

const style = StyleSheet.create({
  menuButton: {
    // zIndex: 9,
    // position: 'absolute',
    // top: 20,
    // left: 20,
  }
})