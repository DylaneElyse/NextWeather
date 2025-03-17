import { Link } from "expo-router";
import React from "react";
import { Text, View, StyleSheet, Image, Dimensions } from "react-native";

export default function LandingScreen() {
  // console.log("Styles", styles.text, styles.loginText);
  return (
    <View style={styles.container}>
      <Image source={require('../assets/nextWeatherLogo.png')} style={styles.logo} />
      <Link href="/(tabs)">
      <View style={styles.linkContainer}>
      <Text style={styles.loginText}>Login with Google</Text>
      <Image source={require('../assets/google-icon-logo.png')} style={styles.googleIcon} />
      </View>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#c2e8ff",
    justifyContent: "center",
    alignItems: "center",
  },
  linkContainer: {
    alignItems: "center",
  },
  loginText: {
    marginTop: 20,
    color: "black",
    fontSize: 30,
  },
  logo: {
    width: Dimensions.get("window").width * 0.8,
    height: undefined,
    aspectRatio: 1,
  },
  googleIcon: {
    width: Dimensions.get("window").width * 0.3,
    height: undefined,
    aspectRatio: 0.98,
    paddingTop: 10,
    marginTop: 10,
  },
});
