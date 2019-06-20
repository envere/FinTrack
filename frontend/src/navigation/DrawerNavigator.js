import React from "react";
import { Platform, Dimensions } from "react-native";
import { createDrawerNavigator, createAppContainer } from "react-navigation";

import HomeScreen from "../pages/HomeScreen";
import AccountScreen from "../pages/AccountScreen";
import PortfolioScreen from "../pages/PortfolioScreen";
import TransactionsScreen from "../pages/TransactionsScreen";
import SettingsScreen from "../pages/SettingsScreen";
import MenuDrawer from "./MenuDrawer";

const WIDTH = Dimensions.get("window").width;

const DrawerConfig = {
  drawerWidth: WIDTH * 0.83,
  contentComponent: ({ navigation }) => {
    return <MenuDrawer navigation={navigation} />;
  }
};

const DrawerNavigator = createDrawerNavigator(
  {
    Home: { screen: HomeScreen },
    Account: { screen: AccountScreen },
    Portfolio: { screen: PortfolioScreen },
    Transactions: { screen: TransactionsScreen },
    Settings: { screen: SettingsScreen }
  },
  DrawerConfig
);

export default createAppContainer(DrawerNavigator);
