import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import * as Font from "expo-font";
import { Input, Button } from "react-native-elements";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import React, { useState, useEffect } from "react";

const SignInScreen = ({ navigation }) => {
  const [isFontLoaded, setIsFontLoaded] = useState(false);

  const [value, setValue] = React.useState({
    email: "",
    password: "",
    error: "",
  });

  const auth = getAuth();

  async function signIn() {
    if (value.email === "" || value.password === "") {
      setValue({
        ...value,
        error: "Email and password are mandatory.",
      });
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, value.email, value.password);
    } catch (error) {
      setValue({
        ...value,
        error: error.message,
      });
    }
  }

  const loadFont = async () => {
    await Font.loadAsync({
      "pokemon-font": require("../assets/fonts/pokemon-font.ttf"),
      // Replace './assets/fonts/pokemon-font.ttf' with the actual path to your font file
    });
    setIsFontLoaded(true);
  };

  useEffect(() => {
    loadFont();

    if (value.error !== "") {
      const timer = setTimeout(() => {
        setValue({
          ...value,
          error: "",
        });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [value.error]);

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
          <Text style={styles.errorText}>Error: Wrong Email or Password</Text>
        </View>
      )}
      <Input
        placeholder="Email"
        containerStyle={styles.input}
        value={value.email}
        onChangeText={(text) => setValue({ ...value, email: text })}
        keyboardType="email-address"
        autoCapitalize="none"
        secureTextEntry={false}
      />

      <Input
        placeholder="Password"
        containerStyle={styles.input}
        value={value.password}
        onChangeText={(text) => setValue({ ...value, password: text })}
        secureTextEntry={true}
      />

      <Button
        title="Sign In"
        buttonStyle={styles.buttonText}
        onPress={signIn}
      />
      <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
        <Text style={styles.signUpText}>Don't have an account? Sign Up</Text>
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

export default SignInScreen;
