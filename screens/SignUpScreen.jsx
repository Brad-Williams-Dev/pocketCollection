import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Input, Button } from "react-native-elements";
import * as Font from "expo-font";
import React, { useState, useEffect } from "react";

import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";

const auth = getAuth();
const database = getDatabase();

const SignUpScreen = ({ navigation }) => {
  const [isFontLoaded, setIsFontLoaded] = useState(false);
  const [value, setValue] = React.useState({
    email: "",
    password: "",
    user_name: "",
    error: "",
  });

  const loadFont = async () => {
    await Font.loadAsync({
      "pokemon-font": require("../assets/fonts/pokemon-font.ttf"),
    });
    setIsFontLoaded(true);
  };

  useEffect(() => {
    loadFont();
  }, []);

  async function signUp() {
    if (value.email === "" || value.password === "" || value.user_name === "") {
      setValue({
        ...value,
        error: "Email, password, username are mandatory.",
      });
      return;
    }

    try {
      // Create new user account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        value.email,
        value.password
      );

      // Save username and initial money to Firebase Realtime Database
      const userRef = ref(database, `users/${userCredential.user.uid}`);
      set(userRef, {
        username: value.user_name,
        money: 500,
      });

      // Update value object with new user properties
      setValue({
        ...value,
        error: "",
        displayName: userCredential.user.displayName,
        uid: userCredential.user.uid,
      });

      navigation.navigate("SignIn");
    } catch (error) {
      setValue({
        ...value,
        error: error.message,
      });
    }
  }

  return (
    <View style={styles.container}>
      <Text
        style={
          isFontLoaded
            ? { ...styles.title, fontFamily: "pokemon-font" }
            : styles.title
        }
      >
        Pocket Collection
      </Text>
      <Image
        style={styles.logo}
        source={{
          uri: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png",
        }}
      />
      {!!value.error && (
        <View style={styles.error}>
          <Text>{value.error}</Text>
        </View>
      )}
      <Input
        placeholder="User Name"
        containerStyle={styles.input}
        value={value.user_name}
        onChangeText={(text) => setValue({ ...value, user_name: text })}
      />
      <Input
        placeholder="Email"
        containerStyle={styles.input}
        value={value.email}
        onChangeText={(text) => setValue({ ...value, email: text })}
      />

      <Input
        placeholder="Password"
        containerStyle={styles.input}
        value={value.password}
        onChangeText={(text) => setValue({ ...value, password: text })}
        secureTextEntry={true}
      />
      <Button title="Sign up" buttonStyle={styles.control} onPress={signUp} />
      <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
        <Text style={styles.signUpText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#D7853F",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 48,
    marginBottom: 20,
    color: "#10717F",
    transform: [{ rotate: "-10deg" }, { translateY: -20 }],
  },
  input: {
    height: 40,
    width: "80%",
    borderColor: "#888",
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
  },
  logo: {
    width: 250,
    height: 250,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#10717F",
    padding: 10,
    borderRadius: 10,
    width: "50%",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  signUpText: {
    marginTop: 20,
    color: "#110E0B",
  },
});

export default SignUpScreen;
