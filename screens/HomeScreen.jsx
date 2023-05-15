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
    signOut();
    navigation.navigate("SignIn");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#1A535C" barStyle="light-content" />
      <View style={styles.header}>
        <Text
          style={
            isFontLoaded
              ? { ...styles.title, fontFamily: "pokemon-font" }
              : styles.title
          }
        >
          Pocket Collection
        </Text>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.listBox}
          onPress={() => navigation.navigate("Search")}
        >
          <Icon name="search" size={32} style={styles.icon} />
          <Text style={styles.listText}>Search</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.listBox}
          onPress={() => navigation.navigate("Camera")}
        >
          <Icon name="camera" size={32} style={styles.icon} />
          <Text style={styles.listText}>Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.listBox}
          onPress={() => navigation.navigate("Collection")}
        >
          <Icon name="user" size={32} style={styles.icon} />
          <Text style={styles.listText}>Collection</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.listBox} onPress={handleLogout}>
          <Icon name="sign-out" size={32} style={styles.icon} />
          <Text style={styles.listText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D7853F",
    height: "100%",
  },
  header: {
    alignItems: "center",
    padding: 30,
    backgroundColor: "#D7853F",
  },
  title: {
    fontSize: 48,
    color: "#F7FFF7",
    fontWeight: "bold",
  },
  footer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#8D5727",
  },
  listBox: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 10,
    backgroundColor: "#10717F",
    width: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  listText: {
    fontSize: 24,
    color: "#F7FFF7",
    marginLeft: 20,
    fontWeight: "500",
  },
  icon: {
    color: "#F7FFF7",
  },
});
