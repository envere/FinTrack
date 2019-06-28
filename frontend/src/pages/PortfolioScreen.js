import React, { Component } from "react";
import { StyleSheet, Text, View, Button } from "react-native";

import PageHeader from "../components/PageHeader";
import BottomTab from "../navigation/BottomTab";
import store from "../data/PortfolioStore";
import { FlatList } from "react-native-gesture-handler";

export default class PortfolioScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <PageHeader text="Portfolio" navigation={this.props.navigation} />
        <FlatList
          data={store.getState()}
          renderItem={({ item }) => <Text>{item.name}</Text>}
        />
        <Button
          title="test"
          onPress={() => alert(JSON.stringify(store.getState()))}
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
  }
});
