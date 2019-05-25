import React from 'react'
import {
    Platform,
    Dimensions,
} from 'react-native'
import {
    createDrawerNavigator,
    createAppContainer,
} from 'react-navigation'

import HomeScreen from '../screens/HomeScreen'

const WIDTH = Dimensions.get('window').width

const DrawerNavigator = createDrawerNavigator({
    Home: {
        screen: HomeScreen,
    }
})

export default createAppContainer(DrawerNavigator)