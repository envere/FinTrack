import React from 'react'
import { Platform, Dimensions } from 'react-native'
import { createDrawerNavigator, createAppContainer } from 'react-navigation'

import HomeScreen from '../screens/HomeScreen'
import AccountScreen from '../screens/AccountScreen'
import PortfolioScreen from '../screens/PortfolioScreen'
import TransactionsScreen from '../screens/TransactionsScreen'
import SettingsScreen from '../screens/SettingsScreen'
import MenuDrawer from './MenuDrawer';

const WIDTH = Dimensions.get('window').width

const DrawerConfig = {
  drawerWidth: WIDTH * 0.83,
  contentComponent: ({navigation}) => {
    return(<MenuDrawer />)
  }
}

const DrawerNavigator = createDrawerNavigator(
  {
    Home: {
      screen: HomeScreen
    },
    Account: {
      screen: AccountScreen
    },
    Portfolio: {
      screen: PortfolioScreen
    },
    Transactions: {
      screen: TransactionsScreen
    },
    Settings: {
      screen: SettingsScreen
    },
  },
  DrawerConfig
)

export default createAppContainer(DrawerNavigator)