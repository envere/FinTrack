import React, { Component } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

import SignupForm from "../components/SignupForm";

export default class SignupScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.mainText}>Registration</Text>
        <SignupForm type="Signup" />
        <View style={styles.signupTextCont}>
          <Text style={styles.signupText}>Already have an account?</Text>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate("Login");
            }}
          >
            <Text style={styles.signupButton}> Sign in!</Text>
          </TouchableOpacity>
        </View>
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
  signupTextCont: {
    flexGrow: 1,
    alignItems: "flex-end",
    justifyContent: "center",
    paddingVertical: 16,
    flexDirection: "row"
  },
  signupText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 16
  },
  signupButton: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "500"
  }
});
