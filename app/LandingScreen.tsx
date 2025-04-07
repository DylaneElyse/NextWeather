import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types/types";
import { router } from "expo-router";

type LandingScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Landing"
>;

interface Props {
  navigation: LandingScreenNavigationProp;
}

export default function LandingScreen() {
  const handleContinue = () => {
    console.log("Attempting to navigate to tabs"); 
    router.replace("/(tabs)"); 
  };
  return (
    <View style={styles.container}>
      {/* App Logo/Header */}
      <Image
        source={require("../assets/nextWeatherLogo.png")}
        style={styles.logo}
      />

      {/* Welcome Message */}
      <Text style={styles.title}>Welcome to NextWeather</Text>

      {/* Login Button */}
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => router.push("LoginScreen")}
      >
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>

      {/* Sign Up Option */}
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => router.push("RegisterScreen")}>
          <Text style={styles.signupLink}>Sign Up</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}> Continue without sign up?</Text>
        <TouchableOpacity onPress={handleContinue}>
          <Text style={styles.signupLink}> Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    paddingBottom: 150,
  },
  logo: {
    width: 300,
    height: 300,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 40,
    textAlign: "center",
  },
  loginButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 80,
    borderRadius: 25,
    marginBottom: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  signupContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  signupText: {
    color: "#666",
  },
  signupLink: {
    color: "#007AFF",
    fontWeight: "600",
  },
});
