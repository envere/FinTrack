import React, { Component } from 'react'
import {
  View,
  Text,
  Platform,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'

const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height

export default class MenuDrawer extends Component {

  navLink(nav, text) {
    return(
      <TouchableOpacity style={{height: 50}} onPress={() => {}}>
        <Text style={styles.link}>{text}</Text>
      </TouchableOpacity>
    )
  }

  render() {
    return(
      <View style={styles.container}>
        <View style={styles.topLink}>
          <Text style={styles.username}>UserName</Text>
        </View>
        <View style={styles.botLink}>
          {this.navLink('Home', 'Home')}
          {this.navLink('Portfolio', 'Portfolio')}
          {this.navLink('Transactions', 'Transactions')}
          {this.navLink('Account', 'Account')}
          {this.navLink('Settings', 'Settings')}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightgray',

  },
  topLink: {
    height: 160,
    backgroundColor: '#18325b',
  },
  botLink: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 10,
    paddingBottom: 450,
  },
  link: {
    flex: 1,
    fontSize: 20,
    padding: 6,
    paddingLeft: 14,
    margin: 5,
    textAlign: 'left',
  },
  username: {
    color: 'white',
    paddingTop: 40,
    fontSize: 30,
  },
})