import React, { Component } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { createSwitchNavigator, createAppContainer} from "react-navigation";

import LoginForm from "../components/LoginForm";
import HomeScreen from "./HomeScreen";

class LoginScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.mainText}>FinTrack Login</Text>
        <LoginForm type="Login" />
        <View style={styles.signupTextCont}>
          <Text style={styles.signupText}>Don't have an account yet?</Text>
          <TouchableOpacity>
            <Text style={styles.signupButton}> Sign up!</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const switchNav = createSwitchNavigator({
  Login: { screen: LoginScreen },
  Home: { screen: HomeScreen }
}, {
  initialRouteName: "Login"
})

export default createAppContainer(switchNav);

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
