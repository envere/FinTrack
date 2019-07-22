import React, { Component } from "react";
import { StyleSheet, Text, View, Button, FlatList } from "react-native";
import { ListItem, Left, Right, Container } from "native-base";

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

  formatStringDate(date) {
    const dateOnly = date.substring(0, 10);
    const day = dateOnly.substring(8, 10);
    const month = dateOnly.substring(5, 7);
    const year = dateOnly.substring(0, 4);
    return `${day}-${month}-${year}`;
  }

  replace(category) {
    if (category === "ADD") {
      return "BUY";
    }
    return category;
  }
  render() {
    return (
      <Container>
        <PageHeader text="Transactions" navigation={this.props.navigation} />
        <View style={styles.headerView}>
          <Text style={styles.header}>Stock</Text>
          <Text style={styles.header}>Date/Price</Text>
        </View>
        <View style={styles.list}>
          <FlatList
            data={this.state.stockData}
            renderItem={({ item }) => (
              <ListItem>
                <Left>
                  <View>
                    <Text>
                      {this.replace(item.category)}: {item.symbol} ($
                      {item.price.toFixed(2)})
                    </Text>
                    <Text>Units: {item.units}</Text>
                  </View>
                </Left>
                <Right>
                  <Text>${item.tradeValue.toFixed(2)}</Text>
                  <Text>{this.formatStringDate(item.date)}</Text>
                </Right>
              </ListItem>
            )}
            keyExtractor={(item, index) => index.toString()} // pasted from SO to fix bugs
          />
        </View>
        <Button
          title="Refresh"
          onPress={() => {
            // this refreshes by getting the updated redux state (if any)
          }}
        />
        <BottomTab />
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    backgroundColor: "#F5FCFF"
  },
  headerView: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginHorizontal: "10%"
  },
  header: {
    fontWeight: "bold",
    fontSize: 22
  },
  list: {
    marginHorizontal: "5%",
    width: "90%",
    height: "73.5%" // not too sure how to constrain layout so it's hardcoded 73.5
  }
});
