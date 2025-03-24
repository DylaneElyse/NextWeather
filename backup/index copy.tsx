// import { Link } from "expo-router";
// import React from "react";
// import { Text, View, StyleSheet, Image, Dimensions, TouchableOpacity } from "react-native";
// // import { signInWithGoogle, logOut } from "./firebase-config";
// // import { auth, provider, signInWithPopup, signOut } from "./firebase-config";
// import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";

import { Link } from "expo-router";
import React from "react";
import { Text, View, StyleSheet, Image, Dimensions, TouchableOpacity } from "react-native";
import { getAuth, signInWithCredential, GoogleAuthProvider } from "firebase/auth";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { app } from "./firebase-config";

WebBrowser.maybeCompleteAuthSession();

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export default function LandingScreen() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: "YOUR_EXPO_CLIENT_ID", // From Google Cloud Console
    iosClientId: "YOUR_IOS_CLIENT_ID", // For iOS (optional)
    androidClientId: "YOUR_ANDROID_CLIENT_ID", // For Android (optional)
  });

  React.useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then((result) => {
          console.log("User signed in:", result.user);
        })
        .catch((error) => {
          console.error("Error signing in:", error);
        });
    }
  }, [response]);

// export const signInWithGoogle = async () => {
//   try {
//     const result = await signInWithPopup(auth, provider);
//     console.log(result.user); // User info
//   } catch (error) {
//     console.error(error);
//   }
// };

export const logOut = async () => {
  try {
    await signOut(auth);
    console.log("User signed out");
  } catch (error) {
    console.error(error);
  }
};


// export default function LandingScreen() {
  // console.log("Styles", styles.text, styles.loginText);


//   return (
//     <View style={styles.container}>
//       <Image source={require('../assets/nextWeatherLogo.png')} style={styles.logo} />
//       <Link href="/(tabs)">
//       <View style={styles.linkContainer}>
//       <Text style={styles.loginText}>Login with Google</Text>
//       <Image source={require('../assets/google-icon-logo.png')} style={styles.googleIcon} />
//       </View>
//       </Link>
//     </View>
//   );
// }

export default function LandingScreen() {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/nextWeatherLogo.png')} style={styles.logo} />
      <TouchableOpacity onPress={signInWithGoogle}>
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
