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

  componentDidMount() {
    store.subscribe(() =>
      this.setState({
        stockData: store.getState().stockList
      })
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <PageHeader text="Portfolio" navigation={this.props.navigation} />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "80%",
            marginHorizontal: "10%"
          }}
        >
          <Text style={styles.header}>Stock</Text>
          <Text style={styles.header}>Profit/Loss</Text>
        </View>
        <FlatList
          data={this.state.stockData}
          renderItem={({ item }) => (
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
                width: "80%",
                marginHorizontal: "10%"
              }}
            >
              <View>
                <Text>{JSON.stringify(item)}</Text>
              </View>
              <View />
            </View>
          )}
          keyExtractor={(item, index) => index.toString()} // pasted from SO to fix bugs
        />
        <Button
          title="Refresh"
          onPress={
            () =>
              // this refreshes by getting the updated redux state (if any)
              this.setState({ stockData: store.getState().stockList })

            // we also need to fetch the latest price api through this button
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
  },
  header: {
    fontWeight: "bold",
    fontSize: 22
  }
});
