import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  FlatList,
  useWindowDimensions,
  Modal,
  TouchableOpacity,
} from "react-native";
import * as Font from "expo-font";
import { Input, Button } from "react-native-elements";
import React, { useEffect, useState } from "react";
import { getDatabase, ref, set, onValue, remove } from "firebase/database";
import { database, auth } from "../config/firebase";

const CollectionsScreen = () => {
  const [isFontLoaded, setIsFontLoaded] = useState(false);
  const [collection, setCollection] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  const loadFont = async () => {
    await Font.loadAsync({
      "pokemon-font": require("../assets/fonts/pokemon-font.ttf"),
    });
    setIsFontLoaded(true);
  };

  useEffect(() => {
    loadFont();

    // Get the current user's ID
    const userId = auth.currentUser.uid;

    // Create a reference to the user's collection in the database
    const collectionRef = ref(getDatabase(), `users/${userId}/collection`);

    // Listen for changes to the collection in the database
    const collectionListener = onValue(collectionRef, (snapshot) => {
      // Get the data from the snapshot
      const data = snapshot.val();

      // Convert the data to an array of Pokémon cards
      const collectionArray = data ? Object.values(data) : [];

      // Set the collection state variable
      setCollection(collectionArray);
    });

    // Clean up the listener when the component is unmounted
    return () => {
      collectionListener();
    };
  }, []);

  const windowWidth = useWindowDimensions().width; // Use useWindowDimensions hook to get the window width

  const renderCard = ({ item }) => (
    <View style={styles.collection}>
      <View style={[styles.imageContainer, { width: windowWidth / 2 - 20 }]}>
        <TouchableOpacity
          onPress={() => {
            setSelectedCard(item);
            setModalVisible(true);
          }}
        >
          <Image
            source={{ uri: item.imageUrl }}
            resizeMode="contain"
            style={styles.image}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  const removeCard = () => {
    if (selectedCard) {
      const cardId = selectedCard.id;
      const userId = auth.currentUser.uid;

      // Remove the card from the collection state
      setCollection((prevCollection) =>
        prevCollection.filter((card) => card.id !== cardId)
      );

      // Remove the card from the Firebase database
      const cardRef = ref(
        getDatabase(),
        `users/${userId}/collection/${cardId}`
      );
      remove(cardRef);

      // Close the modal
      setModalVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text
        style={
          isFontLoaded
            ? { ...styles.title, fontFamily: "pokemon-font" }
            : styles.title
        }
      >
        Collections
      </Text>
      <ScrollView contentContainerStyle={styles.scroll}>
        <FlatList
          data={collection}
          numColumns={2}
          renderItem={renderCard}
          keyExtractor={(item, index) => index.toString()}
        />
      </ScrollView>
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedCard && (
              <>
                <Image
                  source={{ uri: selectedCard.imageUrl }}
                  resizeMode="contain"
                  style={styles.modalImage}
                />
                <Button title="Remove Card" onPress={removeCard} />
              </>
            )}
          </View>
        </View>
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
  },
  title: {
    fontSize: 48,
    color: "#10717F",
    marginTop: 100,
    textDecorationLine: "underline",
  },
  scroll: {
    paddingBottom: 10,
  },
  imageContainer: {
    flex: 1,
    marginBottom: 20,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    flex: 1,
    aspectRatio: 1,
    width: "100%",
  },
  collection: {
    alignItems: "center",
    justifyContent: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 20,
  },
  modalImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
});

export default CollectionsScreen;
