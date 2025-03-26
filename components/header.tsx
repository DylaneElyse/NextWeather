import React from "react";
import { Text, View, StyleSheet, Image, Dimensions } from "react-native";

const Header = () => {
  return (
          <View style={styles.persistentHeader}>
            {/* ... rest of your header code ... */}
            <View
              style={{
                justifyContent: "flex-start",
                flexDirection: "row",
                alignItems: "center",
                // marginRight: 250,
              }}
            >
              {/* <Text>Selected City: {searchedCity || "No city selected"}</Text> */}
              {/*Yet to implement a responsive space adjustment between the two icons above.*/}
              <Image
                source={require("../assets/nextWeatherLogo.png")}
                alt="NextWeather logo"
                style={styles.logo}
              />
              <Text style={styles.headerText}>NextWeather</Text>
            </View>
            {/* <View style={{ justifyContent: "flex-end" }}>
              <TouchableOpacity onPress={toggleTemperatureUnit}>
                {temperatureUnit ? (
                  <View style={styles.toggleContainer}>
                    <Image
                      source={require("../../assets/toggle/temperatureToggleC.png")}
                      alt="Celsius"
                      style={styles.toggleImage}
                    />
                    <Text style={styles.headerText}>°C</Text>
                  </View>
                ) : (
                  <View style={styles.toggleContainer}>
                    <Image
                      source={require("../../assets/toggle/temperatureToggleF.png")}
                      alt="Fahrenheit"
                      style={styles.toggleImage}
                    />
                    <Text style={styles.headerText}>°F</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View> */}
          </View>
    
    // <View style={styles.header}>
    //   <Image
    //     source={require("../assets/nextWeatherLogo.png")}
    //     style={styles.logo}
    //   />
    //   <Image
    //     source={require("../assets/settings-gear-dark.png")}
    //     style={styles.logo}
    //   />
    // </View>
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
  // logo: {
  //   width: Dimensions.get("window").width * 0.1,
  //   height: undefined,
  //   aspectRatio: 1,
  // },
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
