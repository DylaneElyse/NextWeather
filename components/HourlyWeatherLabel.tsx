import { View, Text, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import { militaryTimeToStandard } from "./militaryTimeToStandard";

interface HourlyWeatherProps {
  hour: number;
  temperature: number;
  temperatureUnit: string;
}

export default function HourlyWeatherLabel({
  hour,
  temperature: avgTemperature,
  temperatureUnit,
}: HourlyWeatherProps) {

  return (
    <View style={styles.container}>
      <Text style={styles.time}>{militaryTimeToStandard(hour)}</Text>
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
    fontSize: 18,
  },
  temperature: {
    fontSize: 30,
    fontStyle: "italic",
    fontWeight: "bold",
  },
});
