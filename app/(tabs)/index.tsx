import React from "react";
import { Text, View, StyleSheet, TouchableOpacity, Image } from "react-native";
import CityHeader from "../../components/CityHeader";
import CurrentWeatherOverview from "../../components/currentWeatherOverview";
import ThreeHourForecastAPI from "../../components/ThreeHourForecastAPI";
import FiveDaysForecastLabel from "../../components/FiveDaysForecastAPI";
import { useLocalSearchParams } from "expo-router";
import { useTemperature } from "../../contexts/TemperatureContext";
import Header from "../../components/header";

export default function HomeScreen() {
  const { temperatureUnit, temperatureUnitLetter, toggleTemperatureUnit } =
    useTemperature();
  const [cityFiveDaysWeatherData, setCityFiveDaysWeatherData] = React.useState<
    any[]
  >([]);
  const [cityThreeHourWeatherData, setThreeHourWeatherData] = React.useState<
    any[]
  >([]);

  let { searchedCityLat, searchedCityLng } = useLocalSearchParams();
  console.log(searchedCityLat, searchedCityLng);
  if (searchedCityLat == undefined) {
    searchedCityLat = "Calgary";
  }

  return (
    <View style={styles.pageContainer}>
      <Header />
      <View style={styles.container}>
        <View style={{height: "15%", width: "100%", alignContent: "center", padding: 10,}}>
          {/* Yet to implement API call*/}
          <CityHeader
            city={"Calgary"}
            temperature={"10"}
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
