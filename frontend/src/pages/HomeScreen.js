import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Button,
  Text,
  Modal,
  Dimensions,
  TouchableHighlight,
  TextInput
} from "react-native";

import PageHeader from "../components/PageHeader";
import NavigationBar from "../navigation/NavigationBar";
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
    const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${
      this.state.searchSymbol
    }&apikey=1WJTX23D9MKYZMFE`;
    return (
      <View style={styles.container}>
        <PageHeader text="Home" navigation={this.props.navigation} />
        {/* 
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
          <View style={{ marginTop: 22 }}>
            <View>
              <TextInput
                placeholder="stock name"
                onChangeText={text => this.setState({ searchSymbol: text })}
              />
              <TextInput placeholder="number of units" />
              <TextInput placeholder="price" />

              <Button
                title="Add!"
                onPress={() => {
                  fetch(url)
                    .then(res => res.json())
                    .then(res => {
                      const arr = res.bestMatches;
                      let string = "Best matches:\n";
                      arr.map(stock => {
                        const name = `${stock["2. name"]} (Symbol: ${
                          stock["1. symbol"]
                        })\n`;
                        string = string + name;
                      });
                      alert(string);
                    });
                }}
              />

              <TouchableHighlight
                onPress={() => {
                  this.setModalVisible(!this.state.modalVisible);
                }}
              >
                <Text>Cancel</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
        {/* end test modal */}
        <Modal
          style={styles.modal}
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => this.setModalVisible(!this.state.modalVisible)}
        >
          <AddStockForm />
        </Modal>
        <Button
          title="Add stock"
          onPress={() => {
            this.setModalVisible(true);
          }}
        />
        <NavigationBar />
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
