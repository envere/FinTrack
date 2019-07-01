import React, { Component } from "react";
import { View, StyleSheet, Text, Dimensions, Button } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { DatePicker, Header, Left, Right, Body, Title } from "native-base";

import store from "../data/PortfolioStore";
/**
 * array indices:
 * [0] for trade value of <=50k,
 * [1] for 50k< value < 100k
 * [2] for >= 100k
 */
const brokerageFeesList = {
  dbs: [0.0028, 0.0022, 0.0018],
  ocbc: [0.00275, 0.0022, 0.0018],
  uob: [0.00275, 0.0022, 0.002]
};

export default class AddStockForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bank: "dbs", // default value for testing
      symbolPlaceholder: "Stock name",
      symbol: "",
      name: "",
      units: 0,
      date: "",
      price: 0,
      fees: 0
    };
  }

  updateFees() {
    let brokerFees = brokerageFeesList[this.state.bank];
    const rawTotal = this.state.units * this.state.price;
    if (rawTotal < 50000) {
      brokerFees = brokerFees[0];
    } else if (rawTotal < 100000) {
      brokerFees = brokerFees[1];
    } else {
      brokerFees = brokerFees[2];
    }
    let fees = brokerFees * rawTotal;
    if (fees < 25) {
      this.setState({ fees: 25 });
      return rawTotal + 25;
    }
    this.setState({ fees: fees });
    return rawTotal + fees;
  }

  render() {
    const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${
      this.state.symbol
    }&apikey=1WJTX23D9MKYZMFE`;
    const setDate = newDate => this.setState({ date: newDate });
    return (
      <View style={styles.form}>
        <Header>
          <Left />
          <Body>
            <Title>Add Stock</Title>
          </Body>
          <Right />
        </Header>
        <DatePicker
          defaultDate={new Date()}
          minimumDate={new Date(2010, 1, 1)}
          maximumDate={new Date()}
          locale={"en"}
          timeZoneOffsetInMinutes={undefined}
          modalTransparent={false}
          animationType={"fade"}
          androidMode={"default"}
          placeHolderText="Date purchased"
          placeHolderTextStyle={{ color: "#d3d3d3" }}
          onDateChange={setDate}
          ref={input => (this.date = input)}
          disabled={false}
        />
        <TextInput
          style={styles.textbox}
          placeholder={this.state.symbolPlaceholder}
          onChangeText={text => this.setState({ symbol: text })}
          onSubmitEditing={() => {
            fetch(url)
              .then(res => res.json())
              .then(res => {
                const results = res.bestMatches;
                if (results.length === 1) {
                  this.setState({
                    symbol: results[0]["1. symbol"].replace(".SGP", ".SI")
                  });
                  this.setState({
                    symbolPlaceholder: results[0]["1. symbol"].replace(
                      ".SGP",
                      ".SI"
                    )
                  });
                  this.setState({
                    name: results[0]["2. name"]
                  });
                  // get price api and update state accordingly
                } else {
                  alert("more than 1 results obtained");
                }
              });
            this.units.focus();
          }}
        />
        <TextInput
          style={styles.textbox}
          placeholder="Units"
          onChangeText={text => {
            this.setState({ units: parseFloat(text) }, () => this.updateFees());
          }}
          ref={input => (this.units = input)}
          onSubmitEditing={() => this.price.focus()}
        />
        <TextInput
          style={styles.textbox}
          placeholder="Price"
          onChangeText={text => {
            this.setState({ price: parseFloat(text) }, () => this.updateFees());
          }}
          ref={input => (this.price = input)}
          onSubmitEditing={() => this.fees.focus()}
        />
        <TextInput
          style={styles.textbox}
          placeholder={
            this.state.fees === 0 || isNaN(this.state.fees)
              ? "Trading fees"
              : this.state.fees.toString()
          }
          ref={input => (this.fees = input)}
        />
        <Button
          title="add"
          onPress={() => {
            store.dispatch({
              type: "ADD",
              symbol: this.state.symbol,
              name: this.state.name,
              startPrice: this.updateFees(),
              date: this.state.date,
              currPrice: 100000 // get current price from api and calculate
            });
            alert(JSON.stringify(store.getState()));
          }}
        />
      </View>
    );
  }
}

const screen = Dimensions.get("window");

const styles = StyleSheet.create({
  formDEPRECATED: {
    //justifyContent: "center",
    width: "80%",
    height: 280
    //flex: 1,
    //flexDirection: "row",
    //backgroundColor: "black"
  },
  textbox: {
    paddingHorizontal: 16
  }
});