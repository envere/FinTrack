import React, { Component } from "react";
import { StyleSheet, Text, View, Button } from "react-native";

import PageHeader from "../components/PageHeader";
import NavigationBar from "../navigation/NavigationBar";
import store from "../data/PortfolioStore";

export default class PortfolioScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <PageHeader text="Portfolio" navigation={this.props.navigation} />
        <Button title="test" onPress={() => alert(JSON.stringify(store.getState()))} />
        <NavigationBar />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF"
  }
});
