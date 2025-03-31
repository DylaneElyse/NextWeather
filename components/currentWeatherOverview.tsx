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
          style={{ width: 200, height: 200 }}/>
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
    marginTop: -40,
  },
  innerContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    marginTop: -30,
  },
  iconContainer: {
  },
  weatherIcon: {
    width: 180,
    height: 180,
  },
  weatherCondition: {
    fontSize: 40,
    fontWeight: "300",
  },
  minMaxTemperature: {
    fontSize: 40,
    fontWeight: "300",
  },  
});

