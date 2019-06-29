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
          renderItem={({ item }) => (
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
                width: "80%",
                alignItems: "center"
              }}
            >
              <View>
                <Text>{item.symbol}</Text>
                <Text>{item.name}</Text>
              </View>
              <View>
                <Text>{`${(
                  ((item.currPrice - item.startPrice) / item.startPrice) *
                  100
                ).toFixed(2)}%`}</Text>
              </View>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()} // pasted from SO to fix bugs
        />
        <Button
          title="Refresh"
          onPress={() =>
            this.setState({ stockData: store.getState().stockList })
          }
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
