import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Button,
  Text,
  Modal,
  TouchableHighlight,
  TextInput
} from "react-native";

import PageHeader from "../components/PageHeader";
import NavigationBar from "../navigation/NavigationBar";

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
        {/* start test modal */}
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
        <Button
          title="Add stock"
          onPress={() => {
            this.setModalVisible(true);
          }}
        />
        {/* end test modal */}
        <NavigationBar />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF"
  }
});
