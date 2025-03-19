import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet } from "react-native";
import CityHeader from "../../components/temperatureHeader";
import CurrentWeatherOverview from "../../components/currentWeatherOverview";

export default function HomeScreen() {
  const[temperatureUnit, setTemperatureUnit] = useState("C");
  


  return (
    <View style={styles.container}>

      {/* Temperature Toggle */}
      <Text>Temperature Toggle</Text>

      {/* Yet to implement API call*/}
      <CityHeader 
      city={"Calgary"} 
      temperature={"10"}
      temperatureUnit={"C"}/>

      {/* Yet to implement API call*/}
      <CurrentWeatherOverview 
      weatherDescription={"clear sky"}
      minTemperature={"4"}
      maxTemperature={"15"}
      temperatureUnit={"C"}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#c2e8ff",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "black",
    borderStyle: "dashed",
    borderWidth: 2,
    borderRadius: 0,
    
  },
  text: {
    color: "#fff",
  },
});
