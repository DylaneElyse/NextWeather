import React from "react";
import { Text, View, StyleSheet, Image, Dimensions } from "react-native";

const Header = () => {
  return (
          <View style={styles.persistentHeader}>
            <View
              style={{
                justifyContent: "flex-start",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Image
                source={require("../assets/nextWeatherLogo.png")}
                alt="NextWeather logo"
                style={styles.logo}
              />
              <Text style={styles.headerText}>NextWeather</Text>
            </View>
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
  headerText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "semibold",
  },
  persistentHeader: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#286e99",
    color: "#fff",
    justifyContent: "center",
    width: "100%",
    padding: 5,
  },
  logo: {
    width: 30,
    height: 30,
    marginRight: 5,
  },
});
