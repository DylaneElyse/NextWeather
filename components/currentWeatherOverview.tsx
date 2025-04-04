import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Image } from "react-native";

interface currentWeatherOverviewProps {
  weatherCondition: string;
  minTemperature: number;
  maxTemperature: number;
  temperatureUnit: string;
  imageURL: string;
}

export default function CurrentWeatherOverview ({ weatherCondition, minTemperature, maxTemperature, temperatureUnit, imageURL}: currentWeatherOverviewProps ) {
    return (
    <View style={styles.container}>        
      <View style={styles.iconContainer}>
          <Image source={{ uri: imageURL}} 
          alt="icon"
          style={{ width: 180, height: 180 }}/>
      </View>
      <View style={styles.innerContainer}>
          <Text style={styles.weatherCondition}>{weatherCondition}</Text>
          <Text style={styles.minMaxTemperature}>{minTemperature} {temperatureUnit}/{maxTemperature} {temperatureUnit}</Text>
      </View>
    </View>
    );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    marginTop: 0,
    alignItems: "center",
    marginBottom: 16,
  },
  innerContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    marginTop: 0,
  },
  iconContainer: {
  },
  weatherIcon: {
    width: "20%",
    height: "20%",
  },
  weatherCondition: {
    fontSize: 30,
    justifyContent: "center",
    alignContent: "center",
    textAlign: "center",
    fontWeight: "300",
  },
  minMaxTemperature: {
    fontSize: 30,
    fontWeight: "300",
  },  
});

