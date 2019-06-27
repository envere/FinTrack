import { createBottomTabNavigator, createAppContainer } from "react-navigation";

import HomeScreen from "../pages/HomeScreen";
import PortfolioScreen from "../pages/PortfolioScreen";
import TransactionsScreen from "../pages/TransactionsScreen";

const TabNavigator = createBottomTabNavigator({
  /*Home: HomeScreen, << no idea why this is causing ALL the bugs. 
    commented it out and everything worked miraculously */
  Portfolio: PortfolioScreen,
  Transactions: TransactionsScreen
});

export default createAppContainer(TabNavigator);
