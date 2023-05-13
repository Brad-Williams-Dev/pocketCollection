import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import * as Font from "expo-font";
import { useAuthentication } from "../utils/hooks/useAuthentication";
import { getDatabase, ref, onValue } from "firebase/database";
import Icon from "react-native-vector-icons/FontAwesome";

export default function HomeScreen({ navigation }) {
  const { user, signOut } = useAuthentication();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isFontLoaded, setIsFontLoaded] = useState(false);

  const loadFont = async () => {
    await Font.loadAsync({
      "pokemon-font": require("../assets/fonts/pokemon-font.ttf"),
      // Replace './assets/fonts/pokemon-font.ttf' with the actual path to your font file
    });
    setIsFontLoaded(true);
  };

  useEffect(() => {
    loadFont();

    if (user) {
      const database = getDatabase();
      const userRef = ref(database, `users/${user.uid}`);
      onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        setFirstName(data?.first_name || "");
        setLastName(data?.last_name || "");
      });
    }
  }, [user]);

  const handleLogout = () => {
    // Sign out the user
    signOut();

    // Navigate back to the SignIn screen
    navigation.navigate("SignIn");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#ff0000" barStyle="light-content" />
      <View style={styles.header}>
        <Text
          style={
            isFontLoaded
              ? { ...styles.title, fontFamily: "pokemon-font" }
              : styles.title
          }
        >
          Poke Scanner
        </Text>
      </View>
      <View style={styles.footer}>
        <View style={styles.listBox}>
          <Icon
            name="search"
            size={32}
            style={[
              styles.icon,
              {
                color: "#2C413C",
              },
            ]}
            onPress={() => navigation.navigate("Camera")}
          />
          <Text style={styles.listText}>Search</Text>
        </View>
        <View style={styles.listBox}>
          <Icon
            name="camera"
            size={32}
            style={[
              styles.icon,
              {
                color: "#2C413C",
              },
            ]}
            onPress={() => navigation.navigate("Camera")}
          />
          <Text style={styles.listText}>Camera</Text>
        </View>
        <View style={styles.listBox}>
          <Icon
            name="user"
            size={32}
            style={[
              styles.icon,
              {
                color: "#2C413C",
              },
            ]}
            onPress={() => navigation.navigate("Collection")}
          />
          <Text style={styles.listText}>Collection</Text>
        </View>
        <View style={styles.listBox}>
          <Icon
            name="sign-out"
            size={32}
            style={[
              styles.icon,
              {
                color: "#2C413C",
              },
            ]}
            onPress={() => navigation.navigate("Camera")}
          />
          <Text style={styles.listText}>Logout</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#D7853F",
    paddingTop: 10,
  },
  header: {
    backgroundColor: "#D7853F",
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 32,
    paddingLeft: 20,
    color: "#fff",
  },
  icon: {
    margin: 10,
  },
  footer: {
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    height: "100%",
    paddingBottom: 16, // Add bottom padding for spacing
    padding: 60,
  },
  listBox: {
    flexDirection: "row",
    borderWidth: 5,
    borderColor: "#10717F",
    borderRadius: 15,
    width: "80%",
    height: "10%",
    alignItems: "center",
  },
  listText: {
    fontSize: 32,
    color: "#2C413C",
    paddingLeft: 20,
    fontWeight: "bold",
  },
  title: {
    fontSize: 48,
    marginTop: 20,
    marginBottom: -50,
    color: "#10717F",
  },
});
