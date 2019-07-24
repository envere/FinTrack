import React, { Component } from "react";
import { StyleSheet, Text, View, Button, FlatList } from "react-native";
import {
  ListItem,
  Left,
  Right,
  renderLeftHiddenRow,
  renderRightHiddenRow,
  Accordion
} from "native-base";

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
    this.unsubscribe = store.subscribe(() =>
      this.setState({
        stockData: store.getState().stockList
      })
    );
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  calculatePercentage(stock) {
    const startPrice = stock.investedCapital;
    const endPrice = stock.currentValue;
    const percentage = ((endPrice / startPrice - 1) * 100).toFixed(2);
    return percentage >= 0 ? `+${percentage}%` : `-${percentage * -1}%`;
  }

  render() {
    const accordionData = this.state.stockData.map(stock => {
      const data = {
        title: `${stock.symbol} (${this.calculatePercentage(stock)})\n${
          stock.name
        }`,
        content: `Units: ${
          stock.units
        }\nCapital Invested: $${stock.investedCapital.toFixed(
          2
        )}\nCurrent Value: $${stock.currentValue.toFixed(
          2
        )}\nAverage Buying Price: $${(
          stock.investedCapital / stock.units
        ).toFixed(4)}`
      };
      return data;
    });
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
        <View style={styles.list}>
          {/*}  <FlatList
            data={this.state.stockData}
            renderItem={({ item }) => (
              <ListItem>
                <Left>
                  <View>
                    <Text>{item.symbol}</Text>
                    <Text>{item.name}</Text>
                  </View>
                </Left>
                <Right>
                  <Text>{this.calculatePercentage(item)}</Text>
                </Right>
              </ListItem>
            )}
            keyExtractor={(item, index) => index.toString()} // pasted from SO to fix bugs
            />*/}
          <Accordion dataArray={accordionData} expanded={0} />
        </View>
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
  list: {
    height: "73.5%",
    width: "90%",
    marginHorizontal: "5%"
  },
  header: {
    fontWeight: "bold",
    fontSize: 22
  }
});
