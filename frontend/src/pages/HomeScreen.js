import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Button,
  Text,
  Modal,
  Dimensions
} from "react-native";
import { VictoryPie, VictoryChart, VictoryTheme } from "victory-native";
import Svg from "react-native-svg";

import PageHeader from "../components/PageHeader";
import BottomTab from "../navigation/BottomTab";
import AddStockForm from "../components/AddStockForm";
import store from "../data/PortfolioStore";

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      pieData: null
    };
  }

  componentDidMount() {
    store.subscribe(() => {
      const data = store.getState().stockList;
      const totalCapital = data
        .map(stock => stock.investedCapital)
        .reduce((acc, val) => acc + val);
      const makePercent = num => ((num / totalCapital) * 100).toFixed(1) + "%";
      this.setState({
        pieData: data.map(stock => {
          return {
            x: `${stock.symbol}\n(${makePercent(stock.investedCapital)})`,
            y: stock.investedCapital
          };
        })
      });
    });
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
          <AddStockForm setModalVisible={this.setModalVisible.bind(this)} />
        </Modal>
        <VictoryPie
          data={this.state.pieData}
          innerRadius={80}
          padAngle={2}
          labelRadius={93}
          style={{
            labels: { fill: "white", fontSize: 15, fontWeight: "bold" }
          }}
        />
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
