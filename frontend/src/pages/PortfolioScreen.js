import React, { Component } from "react";
import { StyleSheet, Text, View, Button, FlatList } from "react-native";

import PageHeader from "../components/PageHeader";
import BottomTab from "../navigation/BottomTab";
import store from "../data/PortfolioStore";

export default class PortfolioScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stockData: store.getState().stockList
    };
  }
  render() {
    return (
      <View style={styles.container}>
        <PageHeader text="Portfolio" navigation={this.props.navigation} />
        <FlatList
          data={this.state.stockData}
          renderItem={({ item }) => <Text>{item.symbol}</Text>}
          keyExtractor={(item, index) => index.toString()} // pasted from SO to fix bugs
        />
        <Button
          title="Refresh"
          onPress={() => this.setState({ stockData: store.getState().stockList })}
        />
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
