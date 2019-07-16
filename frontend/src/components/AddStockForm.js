import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  Button,
  Picker
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { DatePicker, Header, Left, Right, Body, Title } from "native-base";
import RNSecureStorage, { ACCESSIBLE } from "rn-secure-storage";

import store from "../data/PortfolioStore";
import { nullLiteral } from "@babel/types";

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
      symbol: null,
      name: null,
      units: null,
      date: null,
      price: null,
      fees: null,
      token: null,
      refresh: null,
      userid: null
    };
  }

  updateFees() {
    let brokerFees = brokerageFeesList[this.state.bank];
    const minimumFees = brokerFees[3];
    const rawTotal = this.state.units * this.state.price;
    if (rawTotal < 50000) {
      brokerFees = brokerFees[0];
    } else if (rawTotal < 100000) {
      brokerFees = brokerFees[1];
    } else {
      brokerFees = brokerFees[2];
    }
    const fees = brokerFees * rawTotal;
    if (fees < minimumFees) {
      this.setState({ fees: minimumFees });
      return rawTotal + minimumFees;
    }
    this.setState({ fees: fees });
    return rawTotal + fees;
  }

  processSymbol(symbol) {
    const replaceSGP = symbol.replace(".SGP", ".SI");
    switch (
      replaceSGP // hardcoding to change symbol to more widely used ones
    ) {
      case "AEMN.SI":
        return "A17U.SI";
      case "SPOS.SI":
        return "S08.SI";
      default:
        return replaceSGP;
    }
  }

  isToday(date) {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  dateConvertToIso(date) {
    const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    const month =
      date.getMonth() < 9 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    const year = date.getFullYear();
    return year + "-" + month + "-" + day;
  }

  getPriceByDate(symbol, date) {
    const backendApi =
      "https://orbital-fintrack.herokuapp.com/stock/daily/price";

    RNSecureStorage.get("accessToken").then(val =>
      this.setState({
        token: val
      })
    );

    RNSecureStorage.get("refreshToken").then(val =>
      this.setState({
        refresh: val
      })
    );

    const data = {
      date: this.dateConvertToIso(date),
      symbol: symbol
    };

    fetch(backendApi, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.state.token
      },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(res =>
        this.setState({
          price: JSON.parse(res.price.price).toFixed(4)
        })
      )
      .catch(err =>
        alert(
          err +
            "Please ensure that the stock market is open on that date. (Non-weekends, public holidays etc."
        )
      );
  }

  addStock() {
    const formFilled =
      this.state.symbol &&
      this.state.date &&
      this.state.fees &&
      this.state.price &&
      this.state.name &&
      this.state.units;
    if (!formFilled) {
      alert("Please fill up all the forms!");
      return;
    }
    const stock = {
      userid: this.state.userid,
      symbol: this.state.symbol,
      name: this.state.name,
      units: this.state.units,
      investedCapital: this.state.units * this.state.price + this.state.fees,
      tradeValue: this.state.units * this.state.price + this.state.fees,
      dividends: 0,
      currentValue: this.state.units * this.state.price,
      category: "ADD",
      date: this.dateConvertToIso(this.state.date)
    };
    const portfolioUrl = "https://orbital-fintrack.herokuapp.com/portfolio/add";
    fetch(portfolioUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.state.token
      },
      body: JSON.stringify(stock)
    })
      .then(res => res.json())
      .then(res => res)
      .catch(err => err);

    const transactionsUrl =
      "https://orbital-fintrack.herokuapp.com/transaction/add";
    fetch(transactionsUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.state.token
      },
      body: JSON.stringify(stock)
    })
      .then(res => res.json())
      .then(res => res)
      .catch(err => err);
  }

  render() {
    const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${
      this.state.symbol
    }&apikey=1WJTX23D9MKYZMFE`;

    const latestPriceUrl = symbol =>
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=1WJTX23D9MKYZMFE`;

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
          androidMode={"calendar"}
          placeHolderText="Date purchased"
          placeHolderTextStyle={{ color: "#d3d3d3" }}
          onDateChange={date => {
            setDate(date);
            if (this.state.symbol) {
              this.getPriceByDate(this.state.symbol, date);
            }
          }}
          disabled={false}
        />
        <TextInput
          style={styles.textbox}
          placeholder={this.state.symbolPlaceholder}
          onChangeText={text => this.setState({ symbol: text })}
          onSubmitEditing={() => {
            if (!this.state.date) {
              alert("Please enter the date first!");
            } else {
              fetch(url)
                .then(res => res.json())
                .then(res => {
                  const results = res.bestMatches.filter(
                    data => data["4. region"] === "Singapore"
                  );
                  if (results.length === 1) {
                    const newSymbol = this.processSymbol(
                      results[0]["1. symbol"]
                    );
                    this.setState(
                      {
                        symbol: newSymbol,
                        symbolPlaceholder: newSymbol,
                        name: results[0]["2. name"]
                      },
                      () => {
                        if (this.isToday(this.state.date)) {
                          fetch(latestPriceUrl(newSymbol))
                            .then(res => res.json())
                            .then(res => {
                              const data = res["Global Quote"]["05. price"];
                              this.setState({
                                price: data
                              });
                            })
                            .catch(err =>
                              alert(
                                "Server is busy, please wait for about 1 min"
                              )
                            );
                        } else {
                          // server api: get price by date
                          this.getPriceByDate(
                            this.state.symbol,
                            this.state.date
                          );
                        }
                      }
                    );
                  } else {
                    // implement search suggestions (drop down)
                    alert("more than 1 results obtained");
                  }
                });
              this.units.focus();
            }
          }}
        />
        <TextInput
          style={styles.textbox}
          placeholder="Units"
          keyboardType="numeric"
          onChangeText={text => {
            this.setState({ units: parseFloat(text) }, () => this.updateFees());
          }}
          ref={input => (this.units = input)}
          onSubmitEditing={() => {
            this.updateFees();
            this.price.focus();
          }}
        />
        <TextInput
          style={styles.textbox}
          placeholder={this.state.price ? this.state.price.toString() : "Price"}
          keyboardType="numeric"
          onChangeText={text => {
            this.setState({ price: parseFloat(text) }, () => this.updateFees());
          }}
          ref={input => (this.price = input)}
          onSubmitEditing={() => this.fees.focus()}
        />
        <TextInput
          style={styles.textbox}
          placeholder={
            !this.state.fees || isNaN(this.state.fees)
              ? "Trading fees"
              : this.state.fees.toString()
          }
          ref={input => (this.fees = input)}
          keyboardType="numeric"
        />
        <Picker
          selectedValue={this.state.bank}
          style={{ height: 50, width: 150 }}
          onValueChange={(itemValue, itemIndex) => {
            this.setState({ bank: itemValue });
            this.updateFees();
          }}
        >
          <Picker.Item label="DBS" value="dbs" />
          <Picker.Item label="OCBC" value="ocbc" />
          <Picker.Item label="UOB" value="uob" />
          <Picker.Item label="Citibank" value="citibank" />
        </Picker>

        <View>
          <Text>Summary:</Text>
          <Text>
            {this.state.name} ({this.state.symbol})
          </Text>
          <Text>Stock price: ${this.state.price * this.state.units}</Text>
          <Text>Brokerage fee: ${this.state.fees}</Text>
          <Text>
            Total amount: $
            {this.state.fees + this.state.units * this.state.price}
          </Text>
        </View>
        <Button
          title="add"
          onPress={() => {
            this.addStock();
          }}
        />
        <Button
          title="test"
          onPress={() => {
            //do something
            alert("hi");
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
