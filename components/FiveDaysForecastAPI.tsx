import { View, Text, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";

interface ThreeHoursForecastProps {
    date: string, 
    maxTemperature: string,
    minTemperature: string,
    temperatureUnit: string,
}

export default function FiveDaysForecastLabel (
    {date, maxTemperature, minTemperature, temperatureUnit}:ThreeHoursForecastProps
) {
        // const [hour, setHour] = useState<string>("-");
        // const [avgTemperature, setTemperature] = useState<string>("-")
        // const [temperatureUnit, setTemperatureUnit] = useState<string>("°");

    return(
        <View style={styles.container}>
            <Text style={styles.date}>{date}</Text>
            <Text style={styles.maxTemperature}>{maxTemperature} {temperatureUnit}</Text>
            <Text style={styles.minTemperature}>{minTemperature} {temperatureUnit}</Text>
        </View>
    )
}

    const styles = StyleSheet.create({
        container: {
            display: "flex",
            flexDirection: "column",
            marginLeft: 10,
        },
        date: {
            fontSize: 8,
        },
         maxTemperature: {
            fontSize: 30,
            fontStyle: "italic",
            fontWeight: "bold",
        },
        minTemperature: {
            fontSize: 15,
            fontStyle: "italic",
            fontWeight: "bold",
        },
    })
