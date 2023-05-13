import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { useAuthentication } from "../utils/hooks/useAuthentication";
import { getDatabase, ref, onValue } from "firebase/database";
import Icon from "react-native-vector-icons/FontAwesome";

export default function HomeScreen({ navigation }) {
  const { user, signOut } = useAuthentication();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  useEffect(() => {
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
        <Text style={styles.headerTitle}>PokeScan</Text>
      </View>
      <View style={styles.footer}>
        <Icon
          name="search"
          size={32}
          style={[styles.icon, { color: "#fff" }]}
        />

        <Icon
          name="camera"
          size={32}
          style={[styles.icon, { color: "#fff" }]}
          onPress={() => navigation.navigate("Camera")}
        />

        <Icon name="user" size={32} style={[styles.icon, { color: "#fff" }]} />

        <Icon
          name="sign-out"
          size={32}
          style={[styles.icon, { color: "#fff" }]}
          onPress={handleLogout}
        />
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
    marginLeft: "auto",
    paddingRight: 10,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end", // Align buttons to the bottom of the container
    position: "absolute",
    bottom: 20, // Position buttons at the bottom of the screen
    width: "100%", // Take up the full width of the screen
    paddingHorizontal: 16, // Add horizontal padding for spacing
    paddingBottom: 16, // Add bottom padding for spacing
  },
});
