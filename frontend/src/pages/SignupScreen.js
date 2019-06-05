import React, { Component } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

import SignupForm from "../components/SignupForm";

export default class SignupScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.mainText}>Registration</Text>
        <SignupForm type="Signup" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#18325b",
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  mainText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "white",
    marginVertical: 80
  },
});
