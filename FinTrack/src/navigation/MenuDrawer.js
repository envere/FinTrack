import React, { Component } from 'react'
import {
  View,
  Text,
  Platform,
  Dimensions,
  StyleSheet,
} from 'react-native'

const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height

export default class MenuDrawer extends Component {
  render() {
    return(
      <View style={style.container}>
        <Text>MenuDrawer</Text>
      </View>
    )
  }
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#18325b',

  },
})