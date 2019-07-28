import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity
} from "react-native";
import { withNavigation } from "react-navigation";
import RNSecureStorage, { ACCESSIBLE } from "rn-secure-storage";
import { Toast } from "native-base";

import store from "../data/PortfolioStore";

const url = "https://orbital-fintrack.herokuapp.com/auth/login";

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: null,
      password: null,
      text: "Login",
      token: null
    };
  }

  saveTokens(res) {
    this.setState({ token: res.accesstoken });
    RNSecureStorage.set("accessToken", res.accesstoken, {
      accessible: ACCESSIBLE.WHEN_UNLOCKED
    }).then(
      res => {
        console.log(res);
      },
      err => {
        console.log(err);
      }
    );
    RNSecureStorage.set("refreshToken", res.refreshtoken, {
      accessible: ACCESSIBLE.WHEN_UNLOCKED
    }).then(
      res => {
        console.log(res);
      },
      err => {
        console.log(err);
      }
    );
    RNSecureStorage.set("userid", res.user._id, {
      accessible: ACCESSIBLE.WHEN_UNLOCKED
    }).then(
      res => {
        console.log(res);
      },
      err => {
        console.log(err);
      }
    );
    RNSecureStorage.set("username", res.user.username, {
      accessible: ACCESSIBLE.WHEN_UNLOCKED
    }).then(
      res => {
        console.log(res);
      },
      err => {
        console.log(err);
      }
    );
  }

  getUserData(res) {
    const transactionsUrl =
      "https://orbital-fintrack.herokuapp.com/transaction/get/" + res.user._id;
    fetch(transactionsUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.state.token
      }
    })
      .then(res => res.json())
      .then(res => {
        store.dispatch({
          type: "TRANSACTIONS",
          history: res.transaction.history
        });
      })
      .catch(err => alert(err));

    const portfolioUrl =
      "https://orbital-fintrack.herokuapp.com/portfolio/get/?userid=" +
      res.user._id;
    fetch(portfolioUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.state.token
      }
    })
      .then(res => res.json())
      .then(res => {
        store.dispatch({
          type: "PORTFOLIO",
          portfolio: res.portfolio.symbols
        });
      })
      .catch(err => alert(err));
  }

  login() {
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Origin": "*"
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password
      })
    })
      .then(res => {
        const status = JSON.parse(res.status);
        if (status === 200) {
          Toast.show({
            text: "Login successful!",
            type: "success"
          });
          return res.json();
        }
        throw Error(status);
      })
      .then(res => {
        this.saveTokens(res);
        this.getUserData(res);
        this.props.navigation.navigate("Home");
      })
      .catch(err => {
        this.setState({
          text: "Login"
        });
        if (err.message === "403") {
          Toast.show({
            text: "Incorrect password",
            type: "warning"
          });
        } else if (err.message === "404") {
          Toast.show({
            text: "User not found. Please create an account.",
            type: "warning"
          });
        } else {
          Toast.show({
            text: err,
            type: "warning"
          });
        }
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.inputBox}
          underlineColorAndroid="rgba(0,0,0,0)"
          placeholder="Username"
          placeholderTextColor="#ffffff"
          selectionColor="#fff"
          keyboardType="email-address"
          onChangeText={text => this.setState({ username: text })}
          onSubmitEditing={() => this.password.focus()}
        />
        <TextInput
          style={styles.inputBox}
          underlineColorAndroid="rgba(0,0,0,0)"
          placeholder="Password"
          secureTextEntry={true}
          placeholderTextColor="#ffffff"
          ref={input => (this.password = input)}
          onChangeText={text => this.setState({ password: text })}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            if (this.state.username || this.state.password) {
              this.setState({ text: "Logging in..." });
              this.login();
              return;
            }
            return Toast.show({
              text: "Please enter your credentials",
              type: "warning"
            });
          }}
        >
          <Text style={styles.buttonText}>{this.state.text}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default withNavigation(LoginForm);

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center"
  },

  inputBox: {
    width: 300,
    backgroundColor: "rgba(255, 255,255,0.2)",
    borderRadius: 25,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#ffffff",
    marginVertical: 10
  },
  button: {
    width: 300,
    backgroundColor: "#142135",
    borderRadius: 25,
    marginVertical: 10,
    paddingVertical: 13
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#ffffff",
    textAlign: "center"
  }
});
