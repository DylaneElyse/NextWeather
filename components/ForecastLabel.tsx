import { View, Text, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";

interface ForecastLabelProps {
  date: string;
  maxTemperature: number;
  minTemperature: number;
  temperatureUnit: string;
}

export default function ForecastLabel({
  date,
  maxTemperature,
  minTemperature,
  temperatureUnit,
}: ForecastLabelProps) {

  return (
    <View style={styles.container}>
      <Text style={styles.date}>{date}</Text>
      <Text style={styles.maxTemperature}>
        {maxTemperature}
        {temperatureUnit}
      </Text>
      <Text style={styles.minTemperature}>
        {minTemperature}
        {temperatureUnit}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    height: "80%",
  },
  date: {
    fontSize: 12,
  },
  maxTemperature: {
    fontSize: 25,
    fontStyle: "italic",
    fontWeight: "bold",
  },
  minTemperature: {
    fontSize: 18,
    fontStyle: "italic",
    fontWeight: "bold",
  },
});
