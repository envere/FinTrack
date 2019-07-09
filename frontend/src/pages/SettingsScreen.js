import React, { Component } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";

import PageHeader from "../components/PageHeader";
import BottomTab from "../navigation/BottomTab";

export default class SettingsScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <PageHeader text="Settings" navigation={this.props.navigation} />
        <Button
          title="test"
          onPress={() => {
            alert("test")
          }}
        />
        <Button
          title="get"
          onPress={() => {
            alert("Get")
          }}
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
