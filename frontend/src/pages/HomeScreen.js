import React, { Component } from "react";
import { StyleSheet, View, Button, Text, Modal, TouchableHighlight } from "react-native";

import PageHeader from "../components/PageHeader";
import NavigationBar from "../navigation/NavigationBar";

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false
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
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
          <View style={{ marginTop: 22 }}>
            <View>
              <Text>Hello World!</Text>

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
