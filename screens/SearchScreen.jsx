import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Modal,
  Alert,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { Input, Button } from "react-native-elements";
import Swiper from "react-native-swiper";
import * as Font from "expo-font";
import { useAuthentication } from "../utils/hooks/useAuthentication";
import { getDatabase, ref, set, push } from "firebase/database";
import { database, auth } from "../config/firebase";

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

  const addToCollection = (card) => {
    const userId = auth.currentUser.uid;
    const collectionRef = ref(getDatabase(), `users/${userId}/collection`);

    // Generate a new unique key using push
    const newCardRef = push(collectionRef);

    // Set the card details under the unique key
    set(newCardRef, {
      key: newCardRef.key,
      imageUrl: card.images.small,
      name: card.name,
    });
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
    <SafeAreaView style={styles.container}>
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
            <SafeAreaView key={index} style={styles.centeredView}>
              <SafeAreaView style={styles.modalView}>
                <Image
                  style={styles.logo}
                  source={{
                    uri: card.images.small,
                  }}
                />
                <SafeAreaView style={styles.info}>
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
                        <SafeAreaView style={styles.priceTabs}>
                          <SafeAreaView style={styles.priceCard}>
                            <Text style={styles.priceLabel}>Low</Text>
                            <Text style={styles.priceValue}>
                              ${card.tcgplayer.prices.holofoil.low}
                            </Text>
                          </SafeAreaView>
                          <SafeAreaView style={styles.priceCard}>
                            <Text style={styles.priceLabel}>Mid</Text>
                            <Text style={styles.priceValue}>
                              ${card.tcgplayer.prices.holofoil.mid}
                            </Text>
                          </SafeAreaView>
                          <SafeAreaView style={styles.priceCard}>
                            <Text style={styles.priceLabel}>High</Text>
                            <Text style={styles.priceValue}>
                              ${card.tcgplayer.prices.holofoil.high}
                            </Text>
                          </SafeAreaView>
                          <SafeAreaView style={styles.priceCard}>
                            <Text style={styles.priceLabel}>Market</Text>
                            <Text style={styles.priceValue}>
                              ${card.tcgplayer.prices.holofoil.market}
                            </Text>
                          </SafeAreaView>
                        </SafeAreaView>
                      </>
                    )}
                  <SafeAreaView style={{ marginTop: 50 }}>
                    <Button
                      title="Add to Collection"
                      onPress={() => addToCollection(card)}
                      buttonStyle={styles.closeButton}
                    />
                    <Button
                      title="Close"
                      onPress={() => setModalVisible(false)}
                      buttonStyle={styles.closeButton}
                    />
                  </SafeAreaView>
                </SafeAreaView>
              </SafeAreaView>
            </SafeAreaView>
          ))}
        </Swiper>
      </Modal>
    </SafeAreaView>
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
    resizeMode: "contain",
    marginBottom: 20,
    marginTop: 20,
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
    textAlign: "center",
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
    margin: 5,
  },
  priceTabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginVertical: 10,
    flexWrap: "wrap",
  },
  priceCard: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#eee",
    margin: 5,
    width: "45%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  priceLabel: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  priceValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#10717F",
  },
});

export default SearchScreen;
