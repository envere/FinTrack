import React, { Component } from "react";
import { withNavigation } from "react-navigation";
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

import getTheme from "../../native-base-theme/components";
import FinTrackTheme from "../../native-base-theme/variables/FinTrackTheme";

class BottomTab extends Component {
  render() {
    return (
      <StyleProvider style={getTheme(FinTrackTheme)}>
        <Container>
          <Content />
          <Footer>
            <FooterTab>
              <Button
                vertical
                onPress={() => this.props.navigation.navigate("Home")}
              >
                <Icon name="home" />
                <Text uppercase={false}>Home</Text>
              </Button>
              <Button
                vertical
                onPress={() => this.props.navigation.navigate("Portfolio")}
              >
                <Icon name="stats" />
                <Text uppercase={false}>Portfolio</Text>
              </Button>
              <Button
                vertical
                onPress={() => this.props.navigation.navigate("Transactions")}
              >
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

export default withNavigation(BottomTab);
