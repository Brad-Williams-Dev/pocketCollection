import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, Modal, Alert } from "react-native";
import { Input, Button } from "react-native-elements";
import Swiper from "react-native-swiper";

import * as Font from "expo-font";

const API_KEY = "084fe2c3-a7b3-4d67-93f0-08d06f22e714"; // Replace with your actual API key

const SearchScreen = () => {
  const [isFontLoaded, setIsFontLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [card, setCard] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const loadFont = async () => {
    await Font.loadAsync({
      "pokemon-font": require("../assets/fonts/pokemon-font.ttf"),
    });
    setIsFontLoaded(true);
  };

  const searchCard = async () => {
    try {
      const response = await fetch(
        `https://api.pokemontcg.io/v2/cards?q=name:${searchTerm}`,
        {
          headers: {
            "X-Api-Key": API_KEY,
          },
        }
      );
      const data = await response.json();
      setCard(data.data);
      setModalVisible(true);
    } catch (error) {
      Alert.alert("Error");
    }
  };

  useEffect(() => {
    loadFont();
  }, []);

  return (
    <View style={styles.container}>
      <Text
        style={
          isFontLoaded
            ? { ...styles.title, fontFamily: "pokemon-font" }
            : styles.title
        }
      >
        Search for Cards
      </Text>
      <Image
        style={styles.logo}
        source={{
          uri: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png",
        }}
      />

      <Input
        placeholder="Search"
        containerStyle={styles.input}
        autoCapitalize="none"
        secureTextEntry={false}
        onChangeText={setSearchTerm}
      />
      <Button
        title="Search"
        buttonStyle={styles.buttonText}
        onPress={searchCard}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <Swiper showsButtons={true}>
          {card.map((card, index) => (
            <View key={index} style={styles.centeredView}>
              <View style={styles.modalView}>
                <Image
                  style={styles.logo}
                  source={{
                    uri: card.images.small,
                  }}
                />
                {card.name && (
                  <Text style={styles.modalTitle}>{card.name}</Text>
                )}
                {card.set.releaseDate && (
                  <Text style={styles.modalText}>
                    Year: {card.set.releaseDate}
                  </Text>
                )}
                {card.set.name && (
                  <Text style={styles.modalText}>Set: {card.set.name}</Text>
                )}
                {card.rarity && (
                  <Text style={styles.modalText}>Rarity: {card.rarity}</Text>
                )}
                {card.tcgplayer &&
                  card.tcgplayer.prices &&
                  card.tcgplayer.prices.holofoil && (
                    <>
                      {card.tcgplayer.updatedAt && (
                        <Text style={styles.modalText}>
                          Updated At: {card.tcgplayer.updatedAt}
                        </Text>
                      )}
                      <Text style={styles.modalText}>Prices:</Text>
                      {Object.entries(card.tcgplayer.prices.holofoil).map(
                        ([key, value]) => (
                          <Text key={key} style={styles.modalText}>
                            {key}: ${value}
                          </Text>
                        )
                      )}
                    </>
                  )}

                <Button
                  title="Close"
                  onPress={() => setModalVisible(false)}
                  buttonStyle={styles.closeButton}
                />
              </View>
            </View>
          ))}
        </Swiper>
      </Modal>
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
    height: 350,
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "#F08030", // Pokéball orange
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#3B4CCA", // Pokéball blue
    marginBottom: 15,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    color: "#3B4CCA", // Pokéball blue
  },
  closeButton: {
    backgroundColor: "#3B4CCA", // Pokéball blue
    padding: 10,
    borderRadius: 10,
  },
});

export default SearchScreen;
