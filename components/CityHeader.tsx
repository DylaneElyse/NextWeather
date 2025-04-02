import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet } from "react-native";

interface CityHeaderProps {
  city: string;
  temperature: number;
  temperatureUnit: string;
}

export default function CityHeader({city, temperature, temperatureUnit}: CityHeaderProps) {
    // In alignment with the API doc, location would be
    // equivalent to city.

    return (
    <View>
      <View style={styles.container}>
          <Text style={styles.cityNameText}>{city}</Text>
          <Text style={styles.cityTemperatureText}>{temperature} {temperatureUnit}</Text>
      </View>
    </View>


  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    // backgroundColor: "#25292e",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",

    // borderColor: "black",
    // borderStyle: "dashed",
    // borderWidth: 2,
    // borderRadius: 0,
  },
  cityNameText: {
    // color: "#fff",
    fontSize: 42,
    fontWeight: "500",
    width: "100%",
    marginTop: 12,
  },  
  cityTemperatureText: {
    // color: "#fff",
    fontSize: 42,
    fontWeight: "300",
    marginLeft: 0,
  },
});

