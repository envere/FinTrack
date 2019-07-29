import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Button,
  Text,
  Modal,
  Dimensions
} from "react-native";
import {
  VictoryPie,
  VictoryChart,
  VictoryLine,
  VictoryTheme
} from "victory-native";
import RNSecureStorage from "rn-secure-storage";

import PageHeader from "../components/PageHeader";
import BottomTab from "../navigation/BottomTab";
import AddStockForm from "../components/AddStockForm";
import store from "../data/PortfolioStore";

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      pieData: null,
      transactionsData: null,
      showPie: false,
      token: null,
      priceHistory: [],
      priceHistoryLoaded: false,
      totalCapital: 0,
      portfolioValue: 0,
      portfolioReturns: 0,
      dividendsData: []
    };
  }

  calculatePieData(data) {
    const totalCapital = data.stockList.reduce(
      (acc, val) => acc + val.investedCapital,
      0
    );
    const makePercent = num => ((num / totalCapital) * 100).toFixed(1) + "%";
    this.setState({
      pieData: data.stockList.map(stock => {
        return {
          x: `${stock.symbol}\n(${makePercent(stock.investedCapital)})`,
          y: stock.investedCapital
        };
      })
    });
  }

  calculateTransactionData(data) {
    const transactionsArr = data.transactions
      .slice()
      .reverse()
      .filter(transaction => transaction.category === "ADD")
      .map(transaction => [transaction.tradeValue])
      .reduce((acc, curr) => acc.concat(acc[acc.length - 1] + curr[0]));
    const dates = data.transactions
      .slice()
      .reverse()
      .filter(transaction => transaction.category === "ADD")
      .map(transaction => new Date(transaction.date.substring(0, 10)));
    let transactionsData = [];
    for (i = 0; i < dates.length; i++) {
      transactionsData[i] = {
        y: transactionsArr[i],
        x: dates[i]
      };
    }
    transactionsData.push({
      y: transactionsData[transactionsData.length - 1].y,
      x: new Date()
    });

    const totalValue = transactionsData[transactionsData.length - 1].y;
    this.setState({
      transactionsData: transactionsData,
      totalCapital: totalValue
    });
  }

  calculatePortfolioData(data) {
    this.setState({
      priceHistory: [],
      priceHistoryLoaded: false
    });
    const unitsPerDay = data.transactions
      .slice()
      .reverse()
      .filter(transaction => transaction.category === "ADD")
      .map(transactions => {
        return {
          symbol: transactions.symbol,
          units: transactions.units,
          date: transactions.date
        };
      })
      .reduce((acc, curr) => {
        if (!acc.map(stock => stock.symbol).includes(curr.symbol)) {
          return acc.concat(curr);
        }
        let units = acc.filter(stock => stock.symbol === curr.symbol);
        units = units[units.length - 1].units;
        const updatedTransaction = {
          symbol: curr.symbol,
          units: curr.units + units,
          date: curr.date
        };
        if (acc[acc.length - 1].date === curr.date) {
          acc.pop();
          return acc.concat(updatedTransaction);
        }
        return acc.concat(updatedTransaction);
      }, []);

    this.fetchDividends(unitsPerDay);

    const uniqueList = unitsPerDay.reduce(
      (acc, curr) =>
        acc.map(stock => stock.symbol).includes(curr.symbol)
          ? acc
          : [...acc, curr],
      []
    );
    uniqueList.forEach(stock => {
      const bodyReq = {
        start: stock.date.substring(0, 10),
        end: new Date().toISOString().substring(0, 10),
        symbol: stock.symbol
      };
      const priceRangeApi =
        "https://orbital-fintrack.herokuapp.com/stock/pricerange";
      fetch(priceRangeApi, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.state.token
        },
        body: JSON.stringify(bodyReq)
      })
        .then(res => res.json())
        .then(res => {
          const history = res.prices.days.map(priceDay => {
            const units = unitsPerDay
              .slice()
              .reverse()
              .find(
                transaction =>
                  transaction.date <= priceDay.date &&
                  transaction.symbol === stock.symbol
              ).units;
            return {
              price: priceDay.price * units,
              date: priceDay.date
            };
          });
          const newArr = this.state.priceHistory
            .concat(history)
            .reduce((acc, curr) => {
              if (acc.map(stock => stock.date).includes(curr.date)) {
                return acc.map(stock => {
                  if (stock.date === curr.date) {
                    return {
                      price: stock.price + curr.price,
                      date: stock.date
                    };
                  }
                  return stock;
                });
              }
              return acc.concat(curr);
            }, []);

          const portfolioValue = newArr[newArr.length - 1].price;
          this.setState({
            priceHistory: newArr,
            priceHistoryLoaded: true,
            portfolioValue: portfolioValue,
            portfolioReturns: portfolioValue - this.state.totalCapital
          });
        });
    });
  }

  fetchDividends(portfolioList) {
    const api = "https://orbital-fintrack.herokuapp.com/dividend/dividendrange";
    const stockList = portfolioList.reduce((acc, curr) => {
      if (!acc.map(stock => stock.symbol).includes(curr.symbol)) {
        return acc.concat(curr);
      }
      return acc;
    }, []);

    stockList.forEach(stock => {
      const body = {
        symbol: stock.symbol,
        start: stock.date.substring(0, 10),
        end: new Date().toISOString().substring(0, 10)
      };
      fetch(api, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.state.token
        },
        body: JSON.stringify(body)
      })
        .then(res => res.json())
        .then(res => {
          const divArr = res.dividends.days;
          const transactionList = portfolioList
            .slice()
            .reverse()
            .filter(trans => trans.symbol === stock.symbol);
          divArr.forEach(dividend => {
            const units = transactionList.find(
              trans => dividend.date >= trans.date
            ).units;
            const divTransaction = {
              category: "DIVIDEND",
              units: units,
              symbol: stock.symbol,
              tradeValue: units * dividend.dividend,
              date: dividend.date,
              price: dividend.dividend
            };
            let transactionsArr = store.getState().transactions;
            transactionsArr.push(divTransaction);
            store.dispatch({
              type: "TRANSACTIONS",
              history: transactionsArr
            });
          });
        });
    });
  }

  componentDidMount() {
    RNSecureStorage.get("accessToken").then(val =>
      this.setState({
        token: val
      })
    );

    this.unsubscribe = store.subscribe(() => {
      const data = store.getState();
      if (
        !(
          this.state.priceHistory &&
          this.state.pieData &&
          this.state.transactionsData
        )
      ) {
        this.calculatePieData(data);
        this.calculateTransactionData(data);
        this.calculatePortfolioData(data);
      }
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  graphSelector() {
    if (this.state.showPie) {
      return (
        <View>
          <Text style={styles.header}>Asset Allocation</Text>
          <VictoryPie
            animate={{ duration: 1000 }}
            data={this.state.pieData}
            innerRadius={80}
            padAngle={2}
            labelRadius={93}
            style={{
              labels: { fill: "white", fontSize: 15, fontWeight: "bold" }
            }}
          />
        </View>
      );
    }
    if (this.state.priceHistoryLoaded) {
      return (
        <View>
          <VictoryChart scale={{ x: "time" }} theme={VictoryTheme.material}>
            {
              <VictoryLine
                animate={{ duration: 500 }}
                interpolation="stepAfter"
                style={{
                  data: { stroke: "navy" },
                  parent: { border: "2px solid #ccc" }
                }}
                data={this.state.priceHistory.map(point => {
                  return {
                    x: new Date(point.date.substring(0, 10)),
                    y: point.price
                  };
                })}
              />
            }
            <VictoryLine
              animate={{ duration: 500 }}
              interpolation="stepAfter"
              style={{
                data: { stroke: "orange" },
                parent: { border: "2px solid #ccc" }
              }}
              data={this.state.transactionsData}
            />
          </VictoryChart>
        </View>
      );
    }
    return (
      <View>
        <Text>Please wait while the graph is being generated...</Text>
      </View>
    );
  }

  toggleGraph(boolean) {
    this.setState({
      showPie: boolean
    });
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
        <View style={styles.segment}>
          <Button
            title="Portfolio Performance"
            onPress={() => this.toggleGraph(false)}
          />
          <Button
            title="Asset Allocation"
            onPress={() => this.toggleGraph(true)}
          />
        </View>
        <View>{this.graphSelector()}</View>
        <Text>Portfolio Value: ${this.state.portfolioValue}</Text>
        <Text>Total Invested Capital: ${this.state.totalCapital}</Text>
        <Text>
          Portfolio Returns: ${this.state.portfolioReturns} (
          {(
            (this.state.portfolioReturns / this.state.totalCapital) *
            100
          ).toFixed(2)}
          %)
        </Text>
        <Button
          title="Add stock"
          onPress={() => {
            //this.setModalVisible(true);
            alert(JSON.stringify(store.getState().transactions));
          }}
        />
        <Button
          title="Refresh"
          onPress={() => {
            this.calculatePortfolioData(store.getState());
            this.calculatePieData(store.getState());
            this.calculateTransactionData(store.getState());
            this.setState({
              portfolioReturns:
                this.state.portfolioValue - this.state.totalCapital
            });
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
  segment: {
    flexDirection: "row"
  },
  modal: {
    justifyContent: "center",
    borderRadius: 0,
    shadowRadius: 10,
    width: Dimensions.get("window") - 80,
    height: 280
  },
  header: {
    fontWeight: "bold",
    fontSize: 30
  }
});
