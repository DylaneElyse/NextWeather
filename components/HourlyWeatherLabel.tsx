import { View, Text, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";

interface ThreeHoursForecastProps {
  hour: string;
  temperature: string;
  temperatureUnit: string;
}

export default function HourlyWeatherLabel({
  hour,
  temperature: avgTemperature,
  temperatureUnit,
}: ThreeHoursForecastProps) {

  return (
    <View style={styles.container}>
      <Text style={styles.time}>{hour}</Text>
      <Text style={styles.temperature}>
        {avgTemperature}
        {temperatureUnit}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    marginLeft: 10,
    alignItems: "center",
  },
  time: {
    fontSize: 15,
  },
  temperature: {
    fontSize: 30,
    fontStyle: "italic",
    fontWeight: "bold",
  },
});
