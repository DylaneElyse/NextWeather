import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Image } from "react-native";
import CityHeader from "../../components/CityHeader";
import CurrentWeatherOverview from "../../components/currentWeatherOverview";
import ThreeHourForecastAPI from "../../components/ThreeHourForecastAPI";
import FiveDaysForecastLabel from "../../components/FiveDaysForecastAPI";
import searchableCities from "../../assets/seachableCities.json";

export default function HomeScreen() {
  const[temperatureUnit, setTemperatureUnit] = useState<boolean>(true);
  const[temperatureUnitLetter, setTemperatureUnitLetter]=useState<string>("°C");

  const toggleTemperatureUnit = () => {
    setTemperatureUnit(!temperatureUnit);
    setTemperatureUnitLetter(temperatureUnit ? "°F" : "°C");
};

  return (
    <View style={styles.container}>

      <View style={styles.persistentHeader}>
        <View style={{justifyContent: "flex-start", flexDirection: "row", alignItems: "center"}}>
          <Image
          source={require('../../assets/nextWeatherLogo.png')}
          alt="NextWeather logo"
          style={styles.logo}/>
          <Text>NextWeather</Text>
        </View>
        <View style={{justifyContent: "flex-end"}}>
          <TouchableOpacity
          onPress={toggleTemperatureUnit}>
            {temperatureUnit ? 
            <View style={styles.toggleContainer}>
              <Image
              source={require('../../assets/toggle/temperatureToggleC.png')}
              alt="Celsius"
              style={styles.toggleImage}/>
              <Text>°C</Text>
            </View>
            :
            <View style={styles.toggleContainer}>
              <Image
              source={require('../../assets/toggle/temperatureToggleF.png')}
              alt="Fahrenheit"
              style={styles.toggleImage}/>
              <Text>°F</Text>
            </View>
            }
          </TouchableOpacity>
        </View>
      </View>


      {/* Yet to implement API call*/}
      <CityHeader 
      city={"Calgary"} 
      temperature={"10"}
      temperatureUnit={temperatureUnitLetter}/>

      {/* Yet to implement API call*/}
      <CurrentWeatherOverview 
      weatherDescription={"clear sky"}
      minTemperature={"4"}
      maxTemperature={"15"}
      temperatureUnit={temperatureUnitLetter}
      />
      <Text style={styles.header}>Hourly</Text>
      
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
      
      <Text style={styles.header}>5 Days</Text>

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
  header:{
    fontSize: 10,
  },
  containerThreeHourForecast: {
    display: "flex",
    flexDirection: "row",
    width: 200,
    flexGrow: 1,
    marginTop: 10,
  },
  containerFiveDaysForecast: {
    display: "flex",
    flexDirection: "row",
    width: 200,
    flexGrow: 1,
    marginTop: 10,
  },
  persistentHeader:{
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  toggleImage:{
    width: 30,
    height: 30,
  },
  logo: {
    width: 30,
    height: 30,
    marginRight: 5,
  },
  toggleContainer:{
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  }
});
