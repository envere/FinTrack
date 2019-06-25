import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  Modal,
  Dimensions,
  Button
} from "react-native";
import { TextInput } from "react-native-gesture-handler";

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
      bank: "dbs", // for testing
      symbol: "",
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
    } else {
      this.setState({ fees: fees});
    }
    //return this.state.fees + rawTotal;
  }
  render() {
    return (
      <View>
        <TextInput
          placeholder="Stock Name"
          onChangeText={text => this.setState({ symbol: text })}
          onSubmitEditing={() => this.units.focus()}
        />
        <TextInput
          placeholder="Units"
          onChangeText={text => {
            this.setState({ units: parseFloat(text) }, () => this.updateFees());
          }}
          ref={input => (this.units = input)}
          onSubmitEditing={() => this.date.focus()}
        />
        <TextInput
          placeholder="Date purchased"
          onChangeText={text => this.setState({ date: text })}
          ref={input => (this.date = input)}
          onSubmitEditing={() => this.price.focus()}
        />
        <TextInput
          placeholder="Price"
          onChangeText={text => {
            this.setState({ price: parseFloat(text) }, () => this.updateFees());
          }}
          ref={input => (this.price = input)}
          onSubmitEditing={() => this.fees.focus()}
        />
        <TextInput
          placeholder={
            this.state.fees === 0 || isNaN(this.state.fees)
              ? "Trading fees"
              : this.state.fees.toString()
          }
          //onChangeText={text => this.setState({ fees: text })}
          ref={input => (this.fees = input)}
        />
        <Button title="add" onPress={() => alert(this.state.fees)} />
      </View>
    );
  }
}

const screen = Dimensions.get("window");

const styles = StyleSheet.create({
  modal: {
    justifyContent: "center",
    borderRadius: 0,
    shadowRadius: 10,
    height: 280,
    width: screen.width - 80
  }
});
