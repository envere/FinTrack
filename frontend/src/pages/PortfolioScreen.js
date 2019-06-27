import React, { Component } from "react";
import { StyleSheet, Text, View, Button } from "react-native";

import PageHeader from "../components/PageHeader";
import BottomTab from "../navigation/BottomTab";
import store from "../data/PortfolioStore";

export default class PortfolioScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <PageHeader text="Portfolio" navigation={this.props.navigation} />
        <Button title="test" onPress={() => alert(JSON.stringify(store.getState()))} />
        <BottomTab />
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
