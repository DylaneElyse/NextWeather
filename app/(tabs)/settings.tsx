import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button, TouchableOpacity, Image } from "react-native";
import Header from "../../components/header";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "expo-router";
import { supabase } from "../../lib/supabase";
import { useTemperature } from "../../contexts/TemperatureContext";

export default function SettingsScreen() {
  const { temperatureUnit, temperatureUnitLetter, toggleTemperatureUnit } =
    useTemperature();
  const { user, signOut } = useAuth(); // Get login state from context
  const [username, setUsername] = useState("");
  const router = useRouter();

  console.log(user);

    useEffect(() => {
      const fetchUserProfile = async () => {
        if (!user) return;
  
        const { data, error } = await supabase
          .from("user_details") 
          .select("Username")
          .eq("uuid", user.id) // Match the user ID
          .maybeSingle();
  
        if (error) {
          console.error("Error fetching user profile:", error);
        } else {
          setUsername(data?.Username);
        }
      };

      fetchUserProfile();
    }, [user]);
  
  const handleSignOut = async () => {
    await signOut();
    router.replace("/LoginScreen"); // Redirect to login after signing out
  };

  if (!user) {
    return (
      <View style={styles.pageContainer}>
        <Header />
        <View style={styles.container}>
          <Text style={styles.text}>Please log in to view settings.</Text>
          <Button title="Log In" onPress={() => router.push("/LoginScreen")} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.pageContainer}>
      <Header />
      <View style={styles.container}>

        <View style={styles.sectionContainer}>
          <Text style={styles.headerText}>Settings</Text>
          <View style={styles.lineContainer}>
            <Text style={styles.text}>Temperature Units</Text>
            <View style={{ justifyContent: "flex-end" }}>
              <TouchableOpacity onPress={toggleTemperatureUnit}>
                {temperatureUnit ? (
                  <View style={styles.toggleContainer}>
                    <Image
                      source={require("../../assets/toggle/temperatureToggleC.png")}
                      alt="Celsius"
                      style={styles.toggleImage}
                    />
                    <Text style={styles.toggleText}>°C</Text>
                  </View>
                ) : (
                  <View style={styles.toggleContainer}>
                    <Image
                      source={require("../../assets/toggle/temperatureToggleF.png")}
                      alt="Fahrenheit"
                      style={styles.toggleImage}
                    />
                    <Text style={styles.toggleText}>°F</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.headerText}>User Profile</Text>
          <View style={styles.lineContainer}>
            <Text style={styles.text}>Username:</Text>
            <Text style={styles.text}>{username}</Text>
          </View>
          <View style={styles.lineContainer}>
            <Text style={styles.text}>Email:</Text>
            <Text style={styles.text}> {user?.email}</Text>
          </View>
        </View>

        <TouchableOpacity onPress={handleSignOut} style={styles.button}>
          <Text style={styles.buttonText}>Log Out</Text>
        </TouchableOpacity>
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
  },
  container: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#c2e8ff",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    marginTop: 100,
  },
  lineContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignContent: "center",
    marginTop: 20,
    width: 300,
  },
  sectionContainer: {
    backgroundColor: "#E2F4FF",
    borderRadius: 10,
    padding: 20,
    marginBottom: 30,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    width: 300,
    borderBottomColor: "black",
    borderBottomWidth: 1,
  },
  text: {
    fontSize: 20,
    fontWeight: "semibold",
  },
  button: {
    width: 100,
    height: 30,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "semibold",
  },
  toggleImage: {
    width: 35,
    height: 35,
  },
  toggleContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  toggleText: {
    fontSize: 22,
    fontWeight: "semibold",
    width: 35,
    textAlign: "center",
  },

});
