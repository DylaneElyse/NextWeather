import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Image } from "react-native";
import CityHeader from "../../components/CityHeader";
import CurrentWeatherOverview from "../../components/CurrentWeatherOverview";
import HourlyWeatherLabel from "../../components/HourlyWeatherLabel";
import ForecastLabel from "../../components/ForecastLabel";
import { useLocalSearchParams } from "expo-router";
import { useTemperature } from "../../contexts/TemperatureContext";
import Header from "../../components/header";
import { WEATHER_API_KEY } from "@env";
import { formatMonthDate, formatDay, formatHour } from "../../components/getDayAndTime";
import { militaryTimeToStandard } from "../../components/militaryTimeToStandard";

export default function HomeScreen() {
  const { temperatureUnit, temperatureUnitLetter, toggleTemperatureUnit } = useTemperature();
  const [weatherData, setWeatherData] = React.useState<WeatherData | null>(null);
  let { searchedCityLat, searchedCityLng } = useLocalSearchParams();
  const [currentDate, setCurrentDate] = useState<string>("2000-01-01 00:00:00");

  interface WeatherData {
    location?: {
      name: string;
      lat: string;
      lon: string;
      localtime: string;
    };
    current?: {
      last_updated: string;
      temp_c: number;
      temp_f: number;
      condition: {
        text: string;
        icon: string;
      };
    };
    forecast: {
      forecastday : Array<{
        date: string;
        day: {
          maxtemp_c: number;
          maxtemp_f: number;
          mintemp_c: number;
          mintemp_f: number;
          avgtemp_c: number;
          avgtemp_f: number;
          condition: {
            text: string;
            icon: string;
          }
        };
        hour: Array<{
          time: string;
          temp_c: number;
          temp_f: number; 
          condition: {
            text: string;
            icon: string;
          }}>;
        }>
    }
  }

  
  console.log("LAT/LONG \n", searchedCityLat, searchedCityLng);

  const fetchWeather = async (searchedCityLat: any, searchedCityLng: any) => {
    try {
      const API_KEY = WEATHER_API_KEY; // Replace with your API key
      const url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${searchedCityLat},${searchedCityLng}&days=7`;

    console.log("Fetching weather from:", url); // ✅ Debug API URL
    
    const response = await fetch(url);
  
      if (!response.ok) {
        throw new Error("Failed to fetch weather data");
      }
  
      const data = await response.json();
      console.log("WEATHER DATA\n", data);
      setWeatherData(data);
      OffsetTime();
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  if (searchedCityLat == undefined){
    // Calgary as the default location
    searchedCityLat = "51.05";
    searchedCityLng = "-114.0667";
  }

  useEffect(() => {
    if (searchedCityLat && searchedCityLng) {
      fetchWeather(searchedCityLat, searchedCityLng);
    }
  }, [searchedCityLat, searchedCityLng]);
  

  // To prevent from getting errors when looking for forecast for any hour 
  // after 24:00 of the current day.
  let APIOffsetHour1 = 0;
  let APIOffsetHour2 = 0;
  let APIOffsetHour3 = 0;
  let APIOffsetHour4 = 0;

  let APIOffsetDay1 = 0;
  let APIOffsetDay2 = 0;
  let APIOffsetDay3 = 0;
  let APIOffsetDay4 = 0;

  const OffsetTime = () => {
    switch (parseInt(formatHour(weatherData?.current?.last_updated ??  "1999-01-01 00:00"))) {
        case 21:
          APIOffsetHour4 = -25;
          APIOffsetDay4 = 1;
            return;
        case 22:
          APIOffsetHour4 = -26;
          APIOffsetDay4 = 1;
          APIOffsetHour3 = -25;
          APIOffsetDay3 = 1;
            return;
        case 23:
          APIOffsetHour4 = -27;
          APIOffsetDay4 = 1;
          APIOffsetHour3 = -26;
          APIOffsetDay3 = 1;
          APIOffsetHour2 = -25;
          APIOffsetDay2 = 1;
            return;
        case 24:
          APIOffsetHour4 = -28;
          APIOffsetDay4 = 1;
          APIOffsetHour3 = -27;
          APIOffsetDay3 = 1;
          APIOffsetHour2 = -26;
          APIOffsetDay2 = 1;
          APIOffsetHour1 = -25;
          APIOffsetDay1 = 1;
            return;
        default:
            return;
    }
  };

  return (
    <View style={styles.pageContainer}>
      <Header />
      {temperatureUnit ? 
      // CELSIUS
      
      <View style={styles.container}>
        <View style={{height: "15%", width: "100%", alignContent: "center", padding: 10,}}>
          {temperatureUnit ?
          <CityHeader
            city={weatherData?.location?.name ?? "Unknown"}
            temperature={weatherData?.current?.temp_c ?? -10}
            temperatureUnit={temperatureUnitLetter}
          />
          :
          <CityHeader
            city={weatherData?.location?.name ?? "Unknown"}
            temperature={weatherData?.current?.temp_c ?? -100}
            temperatureUnit={temperatureUnitLetter}
          />
          }
        </View>

        <View style={{height: "30%", width: "100%",}}>
          <CurrentWeatherOverview
            weatherCondition={weatherData?.current?.condition.text ?? "Condition"}
            minTemperature={weatherData?.forecast.forecastday[0].day.mintemp_c ?? 0}
            maxTemperature={weatherData?.forecast.forecastday[0].day.maxtemp_c ?? 0}
            temperatureUnit={temperatureUnitLetter}
            imageURL={"https:" + weatherData?.forecast.forecastday[0].day.condition.icon}
          />
        </View>

        <View style={{height: "10%", width: "100%",}}>
          <Text style={styles.header}>Hourly</Text>
        </View>

        <View style={styles.containerCurrentWeather}>
          <HourlyWeatherLabel
            hour={parseInt(formatHour(weatherData?.current?.last_updated ?? "1999-01-01 00:00")) + 1 + APIOffsetHour1}
            temperature={weatherData?.forecast.forecastday[0 + APIOffsetDay1].hour[parseInt(formatHour(weatherData?.current?.last_updated ?? "1999-01-01 00:00")) + 1 + APIOffsetHour1].temp_c ?? -100}
            temperatureUnit={temperatureUnitLetter}
          />
          <HourlyWeatherLabel
            hour={parseInt(formatHour(weatherData?.current?.last_updated ?? "1999-01-01 00:00")) + 2 + APIOffsetHour2}
            temperature={weatherData?.forecast.forecastday[0 + APIOffsetDay2].hour[parseInt(formatHour(weatherData?.current?.last_updated ?? "1999-01-01 00:00")) + 2 + APIOffsetHour2].temp_c ?? -100}
            temperatureUnit={temperatureUnitLetter}
          />
          <HourlyWeatherLabel
            hour={parseInt(formatHour(weatherData?.current?.last_updated ?? "1999-01-01 00:00")) + 3 + APIOffsetHour3}
            temperature={weatherData?.forecast.forecastday[0 + APIOffsetDay3].hour[parseInt(formatHour(weatherData?.current?.last_updated ?? "1999-01-01 00:00")) + 3 + APIOffsetHour3].temp_c ?? -100}
            temperatureUnit={temperatureUnitLetter}
          />
          <HourlyWeatherLabel
            hour={parseInt(formatHour(weatherData?.current?.last_updated ?? "1999-01-01 00:00")) + 4 + APIOffsetHour4}
            temperature={weatherData?.forecast.forecastday[0 + APIOffsetDay4].hour[parseInt(formatHour(weatherData?.current?.last_updated ?? "1999-01-01 00:00")) + 1 + APIOffsetHour4].temp_c ?? -100}
            temperatureUnit={temperatureUnitLetter}
          />
        </View>

        <View style={{height: "10%", width: "100%"}}>
          <Text style={styles.header}>5 Days</Text>
        </View>

        <View style={styles.containerForecast}>
          <ForecastLabel
            date={formatMonthDate(weatherData?.forecast.forecastday[1].date ?? "1999-01-01 00:00:00")}
            maxTemperature={weatherData?.forecast.forecastday[1].day.maxtemp_c ?? -100}
            minTemperature={weatherData?.forecast.forecastday[1].day.mintemp_c ?? -100}
            temperatureUnit={temperatureUnitLetter}
          />
          <ForecastLabel
            date={formatMonthDate(weatherData?.forecast.forecastday[2].date ?? "1999-01-01 00:00:00")}
            maxTemperature={weatherData?.forecast.forecastday[2].day.maxtemp_c ?? -100}
            minTemperature={weatherData?.forecast.forecastday[2].day.mintemp_c ?? -100}
            temperatureUnit={temperatureUnitLetter}
          />
          <ForecastLabel
            date={formatMonthDate(weatherData?.forecast.forecastday[3].date ?? "1999-01-01 00:00:00")}
            maxTemperature={weatherData?.forecast.forecastday[3].day.maxtemp_c ?? -100}
            minTemperature={weatherData?.forecast.forecastday[3].day.mintemp_c ?? -100}
            temperatureUnit={temperatureUnitLetter}
          />
          <ForecastLabel
            date={formatMonthDate(weatherData?.forecast.forecastday[4].date ?? "1999-01-01 00:00:00")}
            maxTemperature={weatherData?.forecast.forecastday[4].day.maxtemp_c ?? -100}
            minTemperature={weatherData?.forecast.forecastday[4].day.mintemp_c ?? -100}
            temperatureUnit={temperatureUnitLetter}
          />
           <ForecastLabel
            date={formatMonthDate(weatherData?.forecast.forecastday[5].date ?? "1999-01-01 00:00:00")}
            maxTemperature={weatherData?.forecast.forecastday[5].day.maxtemp_c ?? -100}
            minTemperature={weatherData?.forecast.forecastday[5].day.mintemp_c ?? -100}
            temperatureUnit={temperatureUnitLetter}
          />
        </View>
      </View>

      :

      // FARENHEIT
      <View style={styles.container}>
      <View style={{height: "15%", width: "100%", alignContent: "center", padding: 10,}}>
        {temperatureUnit ?
        <CityHeader
          city={weatherData?.location?.name ?? "Unknown"}
          temperature={weatherData?.current?.temp_f ?? -10}
          temperatureUnit={temperatureUnitLetter}
        />
        :
        <CityHeader
          city={weatherData?.location?.name ?? "Unknown"}
          temperature={weatherData?.current?.temp_f ?? -100}
          temperatureUnit={temperatureUnitLetter}
        />
        }
      </View>

      <View style={{height: "30%", width: "100%",}}>
        <CurrentWeatherOverview
          weatherCondition={weatherData?.current?.condition.text ?? "Condition"}
          minTemperature={weatherData?.forecast.forecastday[0].day.mintemp_f ?? 0}
          maxTemperature={weatherData?.forecast.forecastday[0].day.maxtemp_f ?? 0}
          temperatureUnit={temperatureUnitLetter}
          imageURL={"https:" + weatherData?.forecast.forecastday[0].day.condition.icon}
        />
      </View>

      <View style={{height: "10%", width: "100%",}}>
        <Text style={styles.header}>Hourly</Text>
      </View>

      <View style={styles.containerCurrentWeather}>
        <HourlyWeatherLabel
          hour={parseInt(formatHour(weatherData?.current?.last_updated ?? "1999-01-01 00:00")) + 1 + APIOffsetHour1}
          temperature={weatherData?.forecast.forecastday[0 + APIOffsetDay1].hour[parseInt(formatHour(weatherData?.current?.last_updated ?? "1999-01-01 00:00")) + 1 + APIOffsetHour1].temp_f ?? -100}
          temperatureUnit={temperatureUnitLetter}
        />
        <HourlyWeatherLabel
          hour={parseInt(formatHour(weatherData?.current?.last_updated ?? "1999-01-01 00:00")) + 2 + APIOffsetHour2}
          temperature={weatherData?.forecast.forecastday[0 + APIOffsetDay2].hour[parseInt(formatHour(weatherData?.current?.last_updated ?? "1999-01-01 00:00")) + 2 + APIOffsetHour2].temp_f ?? -100}
          temperatureUnit={temperatureUnitLetter}
        />
        <HourlyWeatherLabel
          hour={parseInt(formatHour(weatherData?.current?.last_updated ?? "1999-01-01 00:00")) + 3 + APIOffsetHour3}
          temperature={weatherData?.forecast.forecastday[0 + APIOffsetDay3].hour[parseInt(formatHour(weatherData?.current?.last_updated ?? "1999-01-01 00:00")) + 3 + APIOffsetHour3].temp_f ?? -100}
          temperatureUnit={temperatureUnitLetter}
        />
        <HourlyWeatherLabel
          hour={parseInt(formatHour(weatherData?.current?.last_updated ?? "1999-01-01 00:00")) + 4 + APIOffsetHour4}
          temperature={weatherData?.forecast.forecastday[0 + APIOffsetDay4].hour[parseInt(formatHour(weatherData?.current?.last_updated ?? "1999-01-01 00:00")) + 1 + APIOffsetHour4].temp_f ?? -100}
          temperatureUnit={temperatureUnitLetter}
        />
      </View>

      <View style={{height: "10%", width: "100%"}}>
        <Text style={styles.header}>5 Days</Text>
      </View>

      <View style={styles.containerForecast}>
        <ForecastLabel
          date={formatMonthDate(weatherData?.forecast.forecastday[1].date ?? "1999-01-01 00:00:00")}
          maxTemperature={weatherData?.forecast.forecastday[1].day.maxtemp_f ?? -100}
          minTemperature={weatherData?.forecast.forecastday[1].day.mintemp_f ?? -100}
          temperatureUnit={temperatureUnitLetter}
        />
        <ForecastLabel
          date={formatMonthDate(weatherData?.forecast.forecastday[2].date ?? "1999-01-01 00:00:00")}
          maxTemperature={weatherData?.forecast.forecastday[2].day.maxtemp_f ?? -100}
          minTemperature={weatherData?.forecast.forecastday[2].day.mintemp_f ?? -100}
          temperatureUnit={temperatureUnitLetter}
        />
        <ForecastLabel
          date={formatMonthDate(weatherData?.forecast.forecastday[3].date ?? "1999-01-01 00:00:00")}
          maxTemperature={weatherData?.forecast.forecastday[3].day.maxtemp_f ?? -100}
          minTemperature={weatherData?.forecast.forecastday[3].day.mintemp_f ?? -100}
          temperatureUnit={temperatureUnitLetter}
        />
        <ForecastLabel
          date={formatMonthDate(weatherData?.forecast.forecastday[4].date ?? "1999-01-01 00:00:00")}
          maxTemperature={weatherData?.forecast.forecastday[4].day.maxtemp_f ?? -100}
          minTemperature={weatherData?.forecast.forecastday[4].day.mintemp_f ?? -100}
          temperatureUnit={temperatureUnitLetter}
        />
         <ForecastLabel
          date={formatMonthDate(weatherData?.forecast.forecastday[5].date ?? "1999-01-01 00:00:00")}
          maxTemperature={weatherData?.forecast.forecastday[5].day.maxtemp_f ?? -100}
          minTemperature={weatherData?.forecast.forecastday[5].day.mintemp_f ?? -100}
          temperatureUnit={temperatureUnitLetter}
        />
      </View>
    </View>}
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
  },
  text: {
    color: "#fff",
  },
  header: {
    fontSize: 30,
    paddingTop: 20,
    paddingBottom: 10,
    width: "100%",
  },
  containerCurrentWeather: {
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
  },
  containerForecast: {
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
