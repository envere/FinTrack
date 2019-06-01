import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";

export default class SplashScreen extends Component {
  render() {
    return (
      <View style={styles.view}>
        <Text style={styles.text}>SplashScreen</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    backgroundColor: "#18325b",
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  text: {
    color: "white",
    fontSize: 40,
    fontWeight: "bold",
    textAlign: "center"
  }
});
