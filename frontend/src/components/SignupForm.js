import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity
} from "react-native";
import { withNavigation } from "react-navigation";
import { Toast } from "native-base";

const url = "https://orbital-fintrack.herokuapp.com/auth/register";

function validateEmail(email) {
  const regexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regexp.test(email);
}

class SignupForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      password: "",
      password2: "",
      text: "Sign up!"
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
          onChangeText={text => this.setState({ username: text })}
          onSubmitEditing={() => this.email.focus()}
        />
        <TextInput
          style={styles.inputBox}
          underlineColorAndroid="rgba(0,0,0,0)"
          placeholder="Email"
          placeholderTextColor="#ffffff"
          selectionColor="#fff"
          keyboardType="email-address"
          ref={input => (this.email = input)}
          onChangeText={text => this.setState({ email: text })}
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
          onSubmitEditing={() => this.password2.focus()}
        />
        <TextInput
          style={styles.inputBox}
          underlineColorAndroid="rgba(0,0,0,0)"
          placeholder="Confirm password"
          secureTextEntry={true}
          placeholderTextColor="#ffffff"
          ref={input => (this.password2 = input)}
          onChangeText={text => this.setState({ password2: text })}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            const pwCheck = this.state.password === this.state.password2;
            if (!validateEmail(this.state.email)) {
              Toast.show({
                text: "Please enter a valid email",
                type: "warning"
              });
            } else if (!pwCheck) {
              Toast.show({
                text: "Please ensure that your 2nd password is the same.",
                type: "warning"
              });
            } else if (this.state.password.length < 8) {
              Toast.show({
                text: "Please ensure your password is 8 characters long.",
                type: "warning"
              })
            } else {
              this.setState({ text: "Signing up..." });
              fetch(url, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "Access-Control-Origin": "*"
                },
                body: JSON.stringify({
                  username: this.state.username,
                  email: this.state.email,
                  password: this.state.password
                })
              })
                .then(res => {
                  if (res.status === 201) {
                    Toast.show({
                      text: "Sign up successful!",
                      type: "success"
                    });
                    return this.props.navigation.navigate("Login");
                  }
                  throw res.status;
                })
                .catch(err => {
                  this.setState({ text: "Sign up!" });
                  Toast.show({
                    text: "Error: Username/email is already in use.",
                    type: "warning"
                  });
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

export default withNavigation(SignupForm);

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
