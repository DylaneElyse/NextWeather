import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Image } from "react-native";
import CityHeader from "../../components/CityHeader";
import CurrentWeatherOverview from "../../components/currentWeatherOverview";
import ThreeHourForecastAPI from "../../components/ThreeHourForecastAPI";
import FiveDaysForecastLabel from "../../components/FiveDaysForecastAPI";
import { useLocalSearchParams } from "expo-router";
import { useTemperature } from "../../contexts/TemperatureContext";
import Header from "../../components/header";
import { WEATHER_API_KEY } from "@env";

export default function HomeScreen() {
  const { temperatureUnit, temperatureUnitLetter, toggleTemperatureUnit } = useTemperature();
  const [cityFiveDaysWeatherData, setCityFiveDaysWeatherData] = React.useState<any[]>([]);
  const [cityThreeHoursWeatherData, setCityThreeHoursWeatherData] = React.useState<any[]>([]);
  // current weather API outputs an object:
  const [cityCurrentWeatherData, setCityCurrentWeatherData] = React.useState<any>(null);
  let { searchedCityLat, searchedCityLng } = useLocalSearchParams();
  const [weather, setWeather] = useState<any>(null);

  console.log(searchedCityLat, searchedCityLng);

  useEffect(() => {
    if (searchedCityLat && searchedCityLng) {
      fetchWeatherFiveDays(searchedCityLat, searchedCityLng);
      fetchWeatherCurrent(searchedCityLat, searchedCityLng);
    }
  }, [searchedCityLat, searchedCityLng]);

  
  const fetchWeatherFiveDays = async (searchedCityLat: any, searchedCityLng: any) => {
    try {
      const API_KEY = WEATHER_API_KEY; // Replace with your API key
      let url;
      {temperatureUnit ? (
        // if temperatureUnit is Celsius:
        url = `https://api.openweathermap.org/data/2.5/forecast?lat=${searchedCityLat}&lon=${searchedCityLng}&appid=${API_KEY}&units=metric`
        //     https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}&units=metric
      ) : (
        // if temperatureUnit is Farenheit:
        url = `https://api.openweathermap.org/data/2.5/forecast?lat=${searchedCityLat}&lon=${searchedCityLng}&appid=${API_KEY}&units=imperial`
        //     https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}&units=metric
      )};

    console.log("Fetching weather from:", url); // ✅ Debug API URL
    
    const response = await fetch(url);
  
      if (!response.ok) {
        throw new Error("Failed to fetch weather data");
      }
  
      const data = await response.json();
      console.log(data);
      setCityFiveDaysWeatherData(data);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

    const fetchWeatherCurrent = async (searchedCityLat: any, searchedCityLng: any) => {
    try {
      const API_KEY = WEATHER_API_KEY; // Replace with your API key
      let url;
      {temperatureUnit ? (
        // if temperatureUnit is in Celsius:
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${searchedCityLat}&lon=${searchedCityLng}&appid=${API_KEY}&units=metric`
        //     https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}&units=metric
      ) : (
        // if temperatureUnit is in Farenheit:
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${searchedCityLat}&lon=${searchedCityLng}&appid=${API_KEY}&units=imperial`
        //     https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}&units=metric
      )};

    console.log("Fetching weather from:", url); // ✅ Debug API URL
    
    const response = await fetch(url);
  
      if (!response.ok) {
        throw new Error("Failed to fetch weather data");
      }
  
      const data = await response.json();
      console.log(data);
      setCityCurrentWeatherData(data);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  console.log("Weather State:", weather);

  // useEffect(() => {
  //   const fetchWeatherData = async () => {
  //     if (searchedCityLat && searchedCityLng) {
  //       const weatherDataFiveDays = await fetchWeatherFiveDays(searchedCityLat, searchedCityLng);
  //       const weatherCurrent = await fetchWeatherCurrent(searchedCityLat, searchedCityLng);
  //       setCityCurrentWeatherData(weatherCurrent);
  //       setCityFiveDaysWeatherData(weatherDataFiveDays);
  //     }
  //   };
  //   fetchWeatherData();
  //   console.log(cityCurrentWeatherData);
  // }, [searchedCityLat, searchedCityLng]);


  return (
    <View style={styles.pageContainer}>
      <Header />
      <View style={styles.container}>
        <View style={{height: "15%", width: "100%", alignContent: "center", padding: 10,}}>
          <CityHeader
            city={cityCurrentWeatherData?.name ?? "Unknown"}
            temperature={cityCurrentWeatherData?.[0]?.list?.[0]?.main?.temp ?? "N/A"}
            temperatureUnit={temperatureUnitLetter}
          />
        </View>

        <View style={{height: "30%", width: "100%",}}>
          {/* Yet to implement API call*/}
          <CurrentWeatherOverview
            weatherDescription={"clear sky"}
            minTemperature={"4"}
            maxTemperature={"15"}
            temperatureUnit={temperatureUnitLetter}
          />
        </View>

        <View style={{height: "10%", width: "100%",}}>
          <Text style={styles.header}>Hourly</Text>
        </View>

        {/* Yet to implement API call*/}
        <View style={styles.containerThreeHourForecast}>
          <ThreeHourForecastAPI
            hour={"1pm"}
            temperature={"10"}
            temperatureUnit={temperatureUnitLetter}
          />
          <ThreeHourForecastAPI
            hour={"4pm"}
            temperature={"10"}
            temperatureUnit={temperatureUnitLetter}
          />
          <ThreeHourForecastAPI
            hour={"7pm"}
            temperature={"10"}
            temperatureUnit={temperatureUnitLetter}
          />
          <ThreeHourForecastAPI
            hour={"10pm"}
            temperature={"10"}
            temperatureUnit={temperatureUnitLetter}
          />
        </View>

        <View style={{height: "10%", width: "100%"}}>
          <Text style={styles.header}>5 Days</Text>
        </View>

        <View style={styles.containerFiveDaysForecast}>
          <FiveDaysForecastLabel
            date={"Mar 05"}
            maxTemperature={"20"}
            minTemperature={"10"}
            temperatureUnit={temperatureUnitLetter}
          />
          <FiveDaysForecastLabel
            date={"Mar 06"}
            maxTemperature={"20"}
            minTemperature={"10"}
            temperatureUnit={temperatureUnitLetter}
          />
          <FiveDaysForecastLabel
            date={"Mar 07"}
            maxTemperature={"20"}
            minTemperature={"10"}
            temperatureUnit={temperatureUnitLetter}
          />
          <FiveDaysForecastLabel
            date={"Mar 08"}
            maxTemperature={"20"}
            minTemperature={"10"}
            temperatureUnit={temperatureUnitLetter}
          />
          <FiveDaysForecastLabel
            date={"Mar 09"}
            maxTemperature={"20"}
            minTemperature={"10"}
            temperatureUnit={temperatureUnitLetter}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#c2e8ff",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 35,
    height: "100%",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#c2e8ff",
    justifyContent: "space-evenly",
    alignItems: "center",
    height: "100%",
    // borderColor: "black",
    // borderStyle: "dashed",
    // borderWidth: 2,
    // borderRadius: 0,
  },
  text: {
    color: "#fff",
  },
  header: {
    fontSize: 30,
    paddingTop: 20,
    paddingBottom: 10,
    width: "100%",
    // borderColor: "black",
    // borderStyle: "dashed",
    // borderWidth: 2,
    // borderRadius: 0,

  },
  containerThreeHourForecast: {
    display: "flex",
    flexDirection: "row",
    flexGrow: 1,
    backgroundColor: "#E2F4FF",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 25,
    paddingRight: 25,
    height: "10%",
    // borderColor: "black",
    // borderStyle: "dashed",
    // borderWidth: 2,
    // borderRadius: 0,

  },
  containerFiveDaysForecast: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    flexGrow: 1,
    backgroundColor: "#E2F4FF",
    paddingLeft: 15,
    paddingRight: 15,
    height: "15%",
    // borderColor: "black",
    // borderStyle: "dashed",
    // borderWidth: 2,
    // borderRadius: 0,

  },
  toggleImage: {
    width: 30,
    height: 30,
  },
  toggleContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  forecastContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    flexGrow: 1,
    backgroundColor: "#E2F4FF",
  },
});
