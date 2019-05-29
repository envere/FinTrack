import React, { Component } from "react";
import {
  Container,
  Header,
  Content,
  Footer,
  FooterTab,
  Button,
  Icon,
  Text,
  StyleProvider
} from "native-base";

import getTheme from "./../../native-base-theme/components";
import FinTrackTheme from "./../../native-base-theme/variables/FinTrackTheme";

export default class NavigationBar extends Component {
  render() {
    return (
      <StyleProvider style={getTheme(FinTrackTheme)}>
        <Container>
          <Content />
          <Footer>
            <FooterTab>
              <Button vertical active>
                <Icon name="home" />
                <Text>Home</Text>
              </Button>
              <Button vertical>
                <Icon name="stats" />
                <Text>Portfolio</Text>
              </Button>
              <Button vertical>
                <Icon name="checkmark-circle-outline" />
                <Text>Transactions</Text>
              </Button>
            </FooterTab>
          </Footer>
        </Container>
      </StyleProvider>
    );
  }
}
