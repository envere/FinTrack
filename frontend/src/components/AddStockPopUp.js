import React, { Component } from "react";
import { StyleSheet, Text, Modal } from "react-native";

export default class AddStockPopUp extends Component {
    render() {
        return <Modal style={styles.modal}><Text>hello world</Text></Modal>
    }
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: "center",
    borderRadius: 0,
    shadowRadius: 10,
    height: 280,
    width: screen.width - 80
  }
});
