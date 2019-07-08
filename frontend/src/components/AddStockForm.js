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
 * [3] for the minimum trading fee
 */
const brokerageFeesList = {
  dbs: [0.0028, 0.0022, 0.0018, 25],
  ocbc: [0.00275, 0.0022, 0.0018, 25],
  uob: [0.00275, 0.0022, 0.002, 25],
  citibank: [0.0025, 0.002, 0.0018, 28]
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
    if (fees < brokerFees[3]) {
      this.setState({ fees: brokerFees[3] });
      return rawTotal + brokerFees[3];
    }
    this.setState({ fees: fees });
    return rawTotal + fees;
  }

  isToday(date) {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  getPriceByDate(symbol, date) {
    const backendApi =
      "https://orbital-fintrack.herokuapp.com/stock/daily/price";
    const token =
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InN5bWJvbCI6W10sIl9pZCI6IjVkMTcxNTk5ZmY5NGZmMzczNGJhYmU0ZCIsInVzZXJuYW1lIjoib2Jpd2FuIiwiZW1haWwiOiJoZWxsb3RoZXJlQGplZGljb3VuY2lsLmNvbSIsInBhc3N3b3JkIjoiJDJiJDEyJE9QZGozeC9kOFpTMWlXTkVRNUhzRC5BcU1pc3VsZmhWVldCOWM1ODhIRldjUzd1QUw3eVZLIiwiX192IjowfSwiaWF0IjoxNTYxNzkzOTk1fQ.C0JgUYofL3LIHvg_TunIsucsHbcrk9qc1hngFmGbjos";

    const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    const month =
      date.getMonth() < 10 ? "0" + date.getMonth() : date.getMonth();
    const year = date.getFullYear();

    const data = {
      date: year + "-" + month + "-" + day,
      symbol: symbol
    };

    fetch(backendApi, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(res =>
        this.setState({
          price: JSON.parse(res.price.price).toFixed(4)
        })
      )
      .catch(err => alert(err));
  }

  render() {
    const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${
      this.state.symbol
    }&apikey=1WJTX23D9MKYZMFE`;

    const latestPriceUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${
      this.state.symbol
    }&interval=5min&outputsize=compact&apikey=1WJTX23D9MKYZMFE`;

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
                  if (this.isToday(this.state.date)) {
                    fetch(latestPriceUrl)
                      .then(res => res.json())
                      .then(res => {
                        const data = res["Time Series (5min)"];
                        const value = data[Object.keys(data)[0]]["4. close"];
                        this.setState({
                          price: value
                        });
                      })
                      .catch(err => alert(err));
                  } else {
                    // server api: get price by date
                    this.getPriceByDate(this.state.symbol, this.state.date)
                  }

                  this.setState({
                    symbol: results[0]["1. symbol"].replace(".SGP", ".SI"),
                    symbolPlaceholder: results[0]["1. symbol"].replace(
                      ".SGP",
                      ".SI"
                    ),
                    name: results[0]["2. name"]
                  });
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
          placeholder={
            this.state.price === 0 ? "Price" : this.state.price.toString()
          }
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
              currPrice: this.state.units * price
            });
            alert(JSON.stringify(store.getState()));
          }}
        />
        <Button // will remove after testing
          title="anotherTest"
          onPress={() => {
            const now = new Date("2015-06-29T03:24:00");
            this.getPriceByDate("D05.SI", now);
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
