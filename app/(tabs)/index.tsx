import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import CityHeader from "../../components/CityHeader";
import HourlyWeatherLabel from "../../components/HourlyWeatherLabel";
import ForecastLabel from "../../components/ForecastLabel";
import { useLocalSearchParams } from "expo-router";
import { useTemperature } from "../../contexts/TemperatureContext";
import Header from "../../components/header";
import { WEATHER_API_KEY } from "@env";
import { formatMonthDate, formatHour } from "../../components/getDayAndTime";
import CurrentWeatherOverview from "../../components/currentWeatherOverview";

export default function HomeScreen() {
  const { temperatureUnit, temperatureUnitLetter, toggleTemperatureUnit } = useTemperature();
  const [weatherData, setWeatherData] = React.useState<WeatherData | null>(null);
  let { searchedCityLat, searchedCityLng, searchedCityName } = useLocalSearchParams();

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


  // Hourly forecast for 20:00, 21:00, 22:00, 23:00 in Celsius

  const [tempForecastC, setHourlyTempForecastC] = useState<number[]>([]);
  const [hourForecastC, setHourlyTimeForecastC] = useState<number[]>([]);

  const GetHourlyForecastCelsius = () => {
    let currentHour = parseInt(formatHour(weatherData?.current?.last_updated ??  "1999-01-01 00:00"));
      switch (currentHour) {
        case 20:
          setHourlyTempForecastC(
            [weatherData?.forecast.forecastday[0].hour[21].temp_c ?? -100,
            weatherData?.forecast.forecastday[0].hour[22].temp_c ?? -100,
            weatherData?.forecast.forecastday[0].hour[23].temp_c ?? -100,
            weatherData?.forecast.forecastday[1].hour[0].temp_c ?? -100
          ]);
          setHourlyTimeForecastC([21, 22, 23, 0]);
            return;
        case 21:
          setHourlyTempForecastC(
            [weatherData?.forecast.forecastday[0].hour[22].temp_c ?? -100,
            weatherData?.forecast.forecastday[0].hour[23].temp_c ?? -100,
            weatherData?.forecast.forecastday[1].hour[0].temp_c ?? -100,
            weatherData?.forecast.forecastday[1].hour[1].temp_c ?? -100
          ]);
          setHourlyTimeForecastC([22, 23, 0, 1]);
            return;
        case 22:
          setHourlyTempForecastC(
            [weatherData?.forecast.forecastday[0].hour[23].temp_c ?? -100,
            weatherData?.forecast.forecastday[1].hour[0].temp_c ?? -100,
            weatherData?.forecast.forecastday[1].hour[1].temp_c ?? -100,
            weatherData?.forecast.forecastday[1].hour[2].temp_c ?? -100
          ]);
          setHourlyTimeForecastC([23, 0, 1, 2]);
            return;
        case 23:
          setHourlyTempForecastC([
            weatherData?.forecast.forecastday[1].hour[0].temp_c ?? -100,
            weatherData?.forecast.forecastday[1].hour[1].temp_c ?? -100,
            weatherData?.forecast.forecastday[1].hour[2].temp_c ?? -100,
            weatherData?.forecast.forecastday[1].hour[3].temp_c ?? -100
          ]);
          setHourlyTimeForecastC([0, 1, 2, 3]);
            return;
        default:
          setHourlyTempForecastC(
            [weatherData?.forecast.forecastday[0].hour[parseInt(formatHour(weatherData?.current?.last_updated ?? "1999-01-01 00:00")) + 1].temp_c ?? -100,
            weatherData?.forecast.forecastday[0].hour[parseInt(formatHour(weatherData?.current?.last_updated ?? "1999-01-01 00:00")) + 2].temp_c ?? -100,
            weatherData?.forecast.forecastday[0].hour[parseInt(formatHour(weatherData?.current?.last_updated ?? "1999-01-01 00:00")) + 3].temp_c ?? -100,
            weatherData?.forecast.forecastday[0].hour[parseInt(formatHour(weatherData?.current?.last_updated ?? "1999-01-01 00:00")) + 4].temp_c ?? -100,
          ]);
          setHourlyTimeForecastC([
            parseInt(formatHour(weatherData?.current?.last_updated ?? "1999-01-01 00:00")) + 1,
            parseInt(formatHour(weatherData?.current?.last_updated ?? "1999-01-01 00:00")) + 2,
            parseInt(formatHour(weatherData?.current?.last_updated ?? "1999-01-01 00:00")) + 3,
            parseInt(formatHour(weatherData?.current?.last_updated ?? "1999-01-01 00:00")) + 4,
          ]);
            return;
  }
};
  
  // Hourly forecast for 20:00, 21:00, 22:00, 23:00 in Farenheit

  const [tempForecastF, setHourlyTempForecastF] = useState<number[]>([]);
  const [hourForecastF, setHourlyTimeForecastF] = useState<number[]>([]);

  const GetHourlyForecastFarenheit = () => {
    let currentHour = parseInt(formatHour(weatherData?.current?.last_updated ??  "1999-01-01 00:00"));
      switch (currentHour) {
        case 20:
          setHourlyTempForecastF(
            [weatherData?.forecast.forecastday[0].hour[21].temp_f ?? -100,
            weatherData?.forecast.forecastday[0].hour[22].temp_f ?? -100,
            weatherData?.forecast.forecastday[0].hour[23].temp_f ?? -100,
            weatherData?.forecast.forecastday[1].hour[0].temp_f ?? -100
          ]);
          setHourlyTimeForecastF([21, 22, 23, 0]);
            return;
        case 21:
          setHourlyTempForecastF(
            [weatherData?.forecast.forecastday[0].hour[22].temp_f ?? -100,
            weatherData?.forecast.forecastday[0].hour[23].temp_f ?? -100,
            weatherData?.forecast.forecastday[1].hour[0].temp_f ?? -100,
            weatherData?.forecast.forecastday[1].hour[1].temp_f ?? -100
          ]);
          setHourlyTimeForecastF([22, 23, 0, 1]);
            return;
        case 22:
          setHourlyTempForecastF(
            [weatherData?.forecast.forecastday[0].hour[23].temp_f ?? -100,
            weatherData?.forecast.forecastday[1].hour[0].temp_f ?? -100,
            weatherData?.forecast.forecastday[1].hour[1].temp_f ?? -100,
            weatherData?.forecast.forecastday[1].hour[2].temp_f ?? -100
          ]);
          setHourlyTimeForecastF([23, 0, 1, 2]);
            return;
        case 23:
          setHourlyTempForecastF(
            [weatherData?.forecast.forecastday[1].hour[0].temp_f ?? -100,
            weatherData?.forecast.forecastday[1].hour[1].temp_f ?? -100,
            weatherData?.forecast.forecastday[1].hour[2].temp_f ?? -100,
            weatherData?.forecast.forecastday[1].hour[3].temp_f ?? -100
          ]);
          setHourlyTimeForecastF([0, 1, 2, 3]);
            return;
        default:
          setHourlyTempForecastF(
            [weatherData?.forecast.forecastday[0].hour[parseInt(formatHour(weatherData?.current?.last_updated ?? "1999-01-01 00:00")) + 1].temp_f ?? -100,
            weatherData?.forecast.forecastday[0].hour[parseInt(formatHour(weatherData?.current?.last_updated ?? "1999-01-01 00:00")) + 2].temp_f ?? -100,
            weatherData?.forecast.forecastday[0].hour[parseInt(formatHour(weatherData?.current?.last_updated ?? "1999-01-01 00:00")) + 3].temp_f ?? -100,
            weatherData?.forecast.forecastday[0].hour[parseInt(formatHour(weatherData?.current?.last_updated ?? "1999-01-01 00:00")) + 4].temp_f ?? -100,
          ]);
          setHourlyTimeForecastF([
            parseInt(formatHour(weatherData?.current?.last_updated ?? "1999-01-01 00:00")) + 1,
            parseInt(formatHour(weatherData?.current?.last_updated ?? "1999-01-01 00:00")) + 2,
            parseInt(formatHour(weatherData?.current?.last_updated ?? "1999-01-01 00:00")) + 3,
            parseInt(formatHour(weatherData?.current?.last_updated ?? "1999-01-01 00:00")) + 4,
          ]);
            return;
  }
};

  console.log("LAT/LONG \n", searchedCityLat, searchedCityLng);

  const fetchWeather = async (searchedCityLat: any, searchedCityLng: any) => {
    try {
      const API_KEY = WEATHER_API_KEY; 
      const url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${searchedCityLat},${searchedCityLng}&days=7`;

    console.log("Fetching weather from:", url); // Debug API URL
    
    const response = await fetch(url);
  
      if (!response.ok) {
        throw new Error("Failed to fetch weather data");
      }
  
      const data = await response.json();
      console.log("WEATHER DATA\n", data);
      setWeatherData(data);
      GetHourlyForecastCelsius();
      GetHourlyForecastFarenheit();
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  if (searchedCityLat == undefined){
    // Calgary as the default location
    searchedCityName = "Calgary";
    searchedCityLat = "51.05";
    searchedCityLng = "-114.0667";
  }

  useEffect(() => {
    if (searchedCityLat && searchedCityLng) {
      fetchWeather(searchedCityLat, searchedCityLng);
    }
  }, [searchedCityLat, searchedCityLng]);
  
  useEffect(() => {
    if (searchedCityLat && searchedCityLng) {
      fetchWeather(searchedCityLat, searchedCityLng);
    }
  }, []);

 useEffect(() => {
    if (weatherData) {
      GetHourlyForecastCelsius();
      GetHourlyForecastFarenheit();
    }
  }, [weatherData]);

  return (
    <View style={styles.pageContainer}>
      <Header />
      {temperatureUnit ?
      // Celsius
      <View style={styles.container}>
        <View style={{height: "15%", width: "80%", alignContent: "center", padding: 10,}}>
          <CityHeader
            city={Array.isArray(searchedCityName) ? searchedCityName.join(", ") : searchedCityName}
            temperature={weatherData?.current?.temp_c ?? -10}
            temperatureUnit={temperatureUnitLetter}
          />
        </View>

        <View style={{height: "30%", width: "100%"}}>
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
            hour={hourForecastC[0]}
            temperature={tempForecastC[0]}
            temperatureUnit={temperatureUnitLetter}
          />
          <HourlyWeatherLabel
            hour={hourForecastC[1]}
            temperature={tempForecastC[1]}
            temperatureUnit={temperatureUnitLetter}
          />
          <HourlyWeatherLabel
            hour={hourForecastC[2]}
            temperature={tempForecastC[2]}
            temperatureUnit={temperatureUnitLetter}
          />
          <HourlyWeatherLabel
            hour={hourForecastC[3]}
            temperature={tempForecastC[3]}
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
      // Farenheit
      <View style={styles.container}>
        
        <View style={styles.container}>
        <View style={{height: "15%", width: "100%", alignContent: "center", padding: 10,}}>
          <CityHeader
            city={Array.isArray(searchedCityName) ? searchedCityName.join(", ") : searchedCityName}
            temperature={weatherData?.current?.temp_f ?? -10}
            temperatureUnit={temperatureUnitLetter}
          />
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
            hour={hourForecastF[0]}
            temperature={tempForecastF[0]}
            temperatureUnit={temperatureUnitLetter}
          />
          <HourlyWeatherLabel
            hour={hourForecastF[1]}
            temperature={tempForecastF[1]}
            temperatureUnit={temperatureUnitLetter}
          />
          <HourlyWeatherLabel
            hour={hourForecastF[2]}
            temperature={tempForecastF[2]}
            temperatureUnit={temperatureUnitLetter}
          />
          <HourlyWeatherLabel
            hour={hourForecastF[3]}
            temperature={tempForecastF[3]}
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
      </View>
      }
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