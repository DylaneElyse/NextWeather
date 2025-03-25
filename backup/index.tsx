import { Link } from "expo-router";
import React from "react";
import { Text, View, StyleSheet, Image, Dimensions, TouchableOpacity } from "react-native";
import { getAuth, signInWithCredential, GoogleAuthProvider } from "firebase/auth";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { app } from "./firebase-config"; // Ensure Firebase is initialized here

WebBrowser.maybeCompleteAuthSession(); // Required for web-based auth

const auth = getAuth(app);
// console.log("Redirect URI:", "https://auth.expo.io/@your-username/your-app-slug");
export default function LandingScreen() {
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: "905773755451-6s6rcir6f4sbdedmlpgvmf5rq9mhi3pp.apps.googleusercontent.com", // From Google Cloud Console
    // iosClientId: "YOUR_IOS_CLIENT_ID", // For iOS (optional)
    androidClientId: "905773755451-74j08s4vhncd58lk35tq86mes4nhmaba.apps.googleusercontent.com", // For Android (optional)
    redirectUri: "https://auth.expo.io/madhowie/nextweather", // Ensure this is set in the Google Cloud Console for your project
    
  });

  React.useEffect(() => {
    console.log("Response:", response);
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then((result) => {
          console.log("User signed in:", result.user);
          setLoggedIn(true);
        })
        .catch((error) => {
          console.error("Error signing in:", error);
        });
    }
  }, [response]);

  return (
    <View style={styles.container}>
      {loggedIn ? (<Text>You are logged in</Text>) : (<Text>You are not logged in</Text>)}
      <Image source={require('../assets/nextWeatherLogo.png')} style={styles.logo} />
      <TouchableOpacity onPress={() => promptAsync()} disabled={!request}>
        <View style={styles.linkContainer}>
          <Text style={styles.loginText}>Login with Google</Text>
          <Image source={require('../assets/google-icon-logo.png')} style={styles.googleIcon} />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#c2e8ff",
    justifyContent: "center",
    alignItems: "center",
  },
  linkContainer: {
    alignItems: "center",
  },
  loginText: {
    marginTop: 20,
    color: "black",
    fontSize: 30,
  },
  logo: {
    width: Dimensions.get("window").width * 0.8,
    height: undefined,
    aspectRatio: 1,
  },
  googleIcon: {
    width: Dimensions.get("window").width * 0.3,
    height: undefined,
    aspectRatio: 0.98,
    paddingTop: 10,
    marginTop: 10,
  },
});