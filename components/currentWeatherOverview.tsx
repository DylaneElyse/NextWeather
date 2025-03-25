import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Image } from "react-native";

interface currentWeatherOverviewProps {
  weatherDescription: string;
  // weather.description
  minTemperature: string;
  // temp_min
  maxTemperature: string;
  // temp_max
  temperatureUnit: string;
  // passed through the const within the index page
}

const DisplayWeatherIcon = ({weatherDescription}: {weatherDescription: string}) => {
  switch (weatherDescription) {
    case "clear sky":
      return (
        <Image 
          source={require("../assets/weather_condition_icon/clear_sky.png")}
          style={styles.weatherIcon}/>);
    case "few clouds":
      return (
        <Image 
          source={require("../assets/weather_condition_icon/few_clouds.png")}
          style={styles.weatherIcon}/>);
    case "scattered clouds":
      return (
        <Image 
          source={require("../assets/weather_condition_icon/scattered_cloudy.png")}
          style={styles.weatherIcon}/>
      );
    case "broken clouds":
      return (
        <Image
          source={require("../assets/weather_condition_icon/broken_clouds.png")}
          style={styles.weatherIcon}/>);
    case "shower rain":
      return (
        <Image
          source={require("../assets/weather_condition_icon/shower_rain.png")}
          style={styles.weatherIcon}/>);
    case "rain":
      return (
        <Image
          source={require("../assets/weather_condition_icon/rain.png")}
          style={styles.weatherIcon}/>);
    case "thunderstorm":
      return (
        <Image
          source={require("../assets/weather_condition_icon/thunderstorm.png")}
          style={styles.weatherIcon}/>);
    case "snow":
      return (
        <Image
          source={require("../assets/weather_condition_icon/snow.png")}
          style={styles.weatherIcon}/>);
    case "mist":
      return (
        <Image
          source={require("../assets/weather_condition_icon/mist.png")}
          style={styles.weatherIcon}/>);
    default:
      return null;
  }
};

export default function CurrentWeatherOverview ({ weatherDescription, minTemperature, maxTemperature, temperatureUnit}: currentWeatherOverviewProps ) {
    // In alignment with the API doc, location would be
    // equivalent to city.

    return (
    <View style={styles.container}>        
      <View style={styles.iconContainer}>
          <DisplayWeatherIcon weatherDescription={weatherDescription}/>
      </View>
      <View style={styles.innerContainer}>
          <Text style={styles.minMaxTemperature}>{minTemperature} {temperatureUnit}/{maxTemperature} {temperatureUnit}</Text>
      </View>
    </View>
    );
}

const styles = StyleSheet.create({
  container: {
    marginTop:  30,    
    borderColor: "black",
    borderStyle: "dashed",
    borderWidth: 2,
    borderRadius: 0,
  },
  innerContainer: {
    // flex: 1,
    // backgroundColor: "#25292e",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  iconContainer: {
    // width: 10,
    // height: 10,
  },
  weatherIcon: {
    width: 180,
    height: 180,
  },
  minMaxTemperature: {
    // color: "#fff",
    fontSize: 40,
    fontWeight: "300",
  },  
});

