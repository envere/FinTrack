import React, { Component } from "react";
import { StyleSheet, Text, View, Button } from "react-native";

import PageHeader from "../components/PageHeader";
import BottomTab from "../navigation/BottomTab";

export default class TransactionsScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <PageHeader text="Transactions" navigation={this.props.navigation} />
        <Button title="date test" onPress={() => {
          const dateTest = new Date();
          alert(dateTest)
        }} />
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
