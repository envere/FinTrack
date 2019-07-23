import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Button,
  Text,
  Modal,
  Dimensions,
} from "react-native";

import PageHeader from "../components/PageHeader";
import BottomTab from "../navigation/BottomTab";
import AddStockForm from "../components/AddStockForm";

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      searchSymbol: ""
    };
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }
  render() {
    return (
      <View style={styles.container}>
        <PageHeader text="Home" navigation={this.props.navigation} />
        <Modal
          style={styles.modal}
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => this.setModalVisible(!this.state.modalVisible)}
        >
          <AddStockForm setModalVisible={this.setModalVisible.bind(this)}/>
        </Modal>
        <Button
          title="Add stock"
          onPress={() => {
            this.setModalVisible(true);
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
  },
  modal: {
    justifyContent: "center",
    borderRadius: 0,
    shadowRadius: 10,
    width: Dimensions.get("window") - 80,
    height: 280
  }
});
