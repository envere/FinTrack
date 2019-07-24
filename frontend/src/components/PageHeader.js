import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Header } from "react-native-elements";

import MenuButton from "../components/MenuButton";
import SettingsButton from "../components/SettingsButton";

export default class PageHeader extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Header
          leftComponent={<MenuButton navigation={this.props.navigation} />}
          centerComponent={{
            text: this.props.text,
            style: styles.text
          }}
          rightComponent={<SettingsButton navigation={this.props.navigation} />}
          backgroundColor="#18325b"
          leftContainerStyle={{ paddingLeft: 10, paddingBottom: 20 }}
          centerContainerStyle={{ paddingBottom: 20 }}
          rightContainerStyle={{ paddingRight: 10, paddingBottom: 20 }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
  },
  text: {
    fontSize: 28,
    color: "white",
    fontWeight: "bold"
  }
});
