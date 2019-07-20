import React, { Component } from "react";
import { StyleSheet, Text, View, Button, FlatList } from "react-native";

import PageHeader from "../components/PageHeader";
import BottomTab from "../navigation/BottomTab";
import store from "../data/PortfolioStore";

export default class TransactionsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stockData: store.getState().transactions
    };
  }

  componentDidMount() {
    store.subscribe(() =>
      this.setState({
        stockData: store.getState().transactions
      })
    );
  }

  replace(category) {
    if (category === "ADD") {
      return "BUY";
    }
    return category;
  }
  render() {
    return (
      <View style={styles.container}>
        <PageHeader text="Transactions" navigation={this.props.navigation} />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "80%",
            marginHorizontal: "10%"
          }}
        >
          <Text style={styles.header}>Stock</Text>
          <Text style={styles.header}>Date/Price</Text>
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
              <Text>
                {this.replace(item.category)}: {item.symbol}
              </Text>
              <View>
                <Text>${item.tradeValue}</Text>
                <Text>{item.date}</Text>
              </View>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()} // pasted from SO to fix bugs
        />
        <Button
          title="Refresh"
          onPress={() =>
            // this refreshes by getting the updated redux state (if any)
            this.setState({ stockData: store.getState().transactions })
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
