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

const url = "https://orbital-fintrack.herokuapp.com/auth/login";

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      text: "Login"
    };
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
            //this.props.navigation.navigate("Home")  // writing this on the plane so i gotta bypass auth
            this.setState({
              username: this.state.username
            });
            if (this.state.username === "" || this.state.password === "") {
              alert("Please enter your credentials");
            } else {
              this.setState({ text: "Logging in..." });
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
                    alert("Login successful!");
                    this.props.navigation.navigate("Home");
                    return res.json();
                  }
                  throw Error(status);
                })
                .then(res => {
                  RNSecureStorage.set("user", res.token, {
                    accessible: ACCESSIBLE.WHEN_UNLOCKED
                  }).then(
                    res => {
                      console.log(res);
                    },
                    err => {
                      console.log(err);
                    }
                  );
                })
                .catch(err => {
                  this.setState({
                    text: "Login"
                  });
                  if (err.message === "403") {
                    alert("Incorrect password");
                  } else if (err.message === "404") {
                    alert("User not found. Please create an account.");
                  } else {
                    alert(err.message);
                  }
                });
            }
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
