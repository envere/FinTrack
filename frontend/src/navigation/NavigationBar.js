import React, { Component } from "react";
import { createAppContainer, createStackNavigator } from "react-navigation";
import {
  Container,
  Content,
  Footer,
  FooterTab,
  Button,
  Icon,
  Text,
  StyleProvider
} from "native-base";

import HomeScreen from "../pages/HomeScreen";
import PortfolioScreen from "../pages/PortfolioScreen";
import TransactionsScreen from "../pages/TransactionsScreen";

import getTheme from "../../native-base-theme/components";
import FinTrackTheme from "../../native-base-theme/variables/FinTrackTheme";

{/* const navigator = createStackNavigator({
  Home: HomeScreen,
  Portfolio: PortfolioScreen,
  Transactions: TransactionsScreen
}); */}

export default class NavigationBar extends Component {
  render() {
    return (
      <StyleProvider style={getTheme(FinTrackTheme)}>
        <Container>
          <Content />
          <Footer>
            <FooterTab>
              <Button
                vertical
                active
                //onPress={() => this.props.navigation.navigate("Home")}
              >
                <Icon name="home" />
                <Text uppercase={false}>Home</Text>
              </Button>
              <Button vertical>
                <Icon name="stats" />
                <Text uppercase={false}>Portfolio</Text>
              </Button>
              <Button vertical>
                <Icon name="checkmark-circle-outline" />
                <Text uppercase={false}>Transactions</Text>
              </Button>
            </FooterTab>
          </Footer>
        </Container>
      </StyleProvider>
    );
  }
}

