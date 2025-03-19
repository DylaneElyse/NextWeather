import React from "react";
import { Text, View, StyleSheet, Image, Dimensions } from "react-native";

const Header = () => {
  return (
    <View style={styles.header}>
      <Image
        source={require("../assets/nextWeatherLogo.png")}
        style={styles.logo}
      />
      <Image
        source={require("../assets/settings-gear-dark.png")}
        style={styles.logo}
      />
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#c2e8ff",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: Dimensions.get("window").width * 0.1,
    height: undefined,
    aspectRatio: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
});
