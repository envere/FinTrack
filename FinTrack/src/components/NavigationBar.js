import React, { Component } from "react";
import {
  Container,
  Header,
  Content,
  Footer,
  FooterTab,
  Button,
  Icon,
  Text
} from "native-base";

export default class NavigationBar extends Component {
  render() {
    return (
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
    );
  }
}
