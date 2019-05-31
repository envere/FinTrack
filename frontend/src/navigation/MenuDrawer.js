import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  Dimensions,
  StyleSheet,
  TouchableOpacity
} from "react-native";

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

export default class MenuDrawer extends Component {
  navLink(nav, text) {
    return (
      <TouchableOpacity
        style={{ height: 50 }}
        onPress={() => {
          this.props.navigation.navigate(nav);
        }}
      >
        <Text style={styles.link}>{text}</Text>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.topLink}>
          <View style={styles.profile}>
            <View style={styles.imgView}>
              <Image
                style={styles.img}
                source={require("../images/defaultProfilePic2.png")}
              />
            </View>
            <View style={styles.profileText}>
              <Text style={styles.username}>UserName</Text>
            </View>
          </View>
        </View>
        <ScrollView style={styles.scroll}>
          <View style={styles.botLink}>
            {this.navLink("Home", "Home")}
            {this.navLink("Portfolio", "Portfolio")}
            {this.navLink("Transactions", "Transactions")}
            {this.navLink("Account", "Account")}
            {this.navLink("Settings", "Settings")}
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <Text style={styles.footerNote}>FinTrack</Text>
          <Text style={styles.version}>V1</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightgray"
  },
  scroll: {
    flex: 1
  },
  profile: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 25,
    borderBottomWidth: 1,
    borderBottomColor: "#777777"
  },
  profileText: {
    flex: 3,
    flexDirection: "column",
    justifyContent: "center"
  },
  username: {
    fontSize: 20,
    paddingBottom: 5,
    color: "white",
    textAlign: "left"
  },
  imgView: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20
  },
  img: {
    height: 70,
    width: 70,
    borderRadius: 50
  },
  topLink: {
    height: 160,
    backgroundColor: "#18325b"
  },
  botLink: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 10,
    paddingBottom: 450
  },
  link: {
    flex: 1,
    fontSize: 20,
    padding: 6,
    paddingLeft: 14,
    margin: 5,
    textAlign: "left"
  },
  footer: {
    height: 30,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#18325b",
    borderTopWidth: 1,
    borderTopColor: "lightgray"
  },
  footerNote: {
    flex: 1,
    marginLeft: 20,
    fontSize: 16,
    color: "white"
  },
  version: {
    flex: 1,
    textAlign: "right",
    marginRight: 20,
    color: "white"
  }
});
