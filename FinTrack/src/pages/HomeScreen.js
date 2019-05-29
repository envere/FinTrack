import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
} from 'react-native'
import {
  Header,
} from 'react-native-elements'

import MenuButton from '../components/MenuButton'
import NavigationBar from '../components/NavigationBar'

export default class HomeScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Header 
          leftComponent={<MenuButton navigation={this.props.navigation} />}
          centerComponent={{text: 'Home', style: {color: 'white', fontSize: 28}}}
          backgroundColor='#18325b'
          leftContainerStyle={{paddingLeft: 10, paddingBottom: 20}}
          centerContainerStyle={{paddingBottom: 20}}
        />
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
