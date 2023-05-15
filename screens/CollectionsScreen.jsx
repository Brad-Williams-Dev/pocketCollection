import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  useWindowDimensions,
  Modal,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import * as Font from "expo-font";
import { Input, Button } from "react-native-elements";
import React, { useEffect, useState } from "react";
import {
  getDatabase,
  ref,
  set,
  onValue,
  remove,
  orderByChild,
} from "firebase/database";
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

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const userId = user.uid;
        const collectionRef = ref(database, `users/${userId}/collection`);
        const collectionListener = onValue(collectionRef, (snapshot) => {
          const data = snapshot.val();

          const collectionArray = data
            ? Object.entries(data).map(([key, value]) => ({
                ...value,
                key,
              }))
            : [];

          setCollection(collectionArray);
        });

        return () => {
          collectionListener();
        };
      }
    });

    return unsubscribe;
  }, []);

  const windowWidth = useWindowDimensions().width;

  const renderCard = ({ item }) => {
    const handleRemoveCard = () => {
      setSelectedCard(item);
      setModalVisible(true);
    };

    return (
      <SafeAreaView style={styles.collection}>
        <SafeAreaView
          style={[styles.imageContainer, { width: windowWidth / 2 - 20 }]}
        >
          <TouchableOpacity onPress={handleRemoveCard}>
            <Image
              source={{ uri: item.imageUrl }}
              resizeMode="contain"
              style={styles.image}
            />
          </TouchableOpacity>
        </SafeAreaView>
      </SafeAreaView>
    );
  };

  const removeCard = () => {
    if (selectedCard) {
      const userId = auth.currentUser.uid;
      const cardRef = ref(
        getDatabase(),
        `users/${userId}/collection/${selectedCard.key}`
      );
      remove(cardRef)
        .then(() => {
          console.log("Card successfully removed from Firebase database.");

          setCollection((prevCollection) =>
            prevCollection.filter((card) => card.key !== selectedCard.key)
          );
          setModalVisible(false);
        })
        .catch((error) => {
          // Handle any errors
          console.log("Error removing card:", error);
        });
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
        Collection
      </Text>
      <View style={styles.scroll}>
        <FlatList
          data={collection}
          numColumns={2}
          renderItem={renderCard}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
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
                <View>
                  <TouchableOpacity
                    style={{
                      marginBottom: 10,
                      backgroundColor: "#ffcb05",
                      padding: 10,
                      alignItems: "center",
                      borderRadius: 5,
                    }}
                    onPress={removeCard}
                  >
                    <Text style={{ color: "white" }}>Remove Card</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      marginBottom: 10,
                      backgroundColor: "#ffcb05",
                      padding: 10,
                      alignItems: "center",
                      borderRadius: 5,
                    }}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={{ color: "white" }}>Close</Text>
                  </TouchableOpacity>
                </View>
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
    backgroundColor: "#3c5aa6",
    alignItems: "center",
  },
  title: {
    fontSize: 48,
    color: "#ffcb05",
    marginTop: Platform.OS === "ios" ? 100 : 40,
    textDecorationLine: "underline",
  },
  scroll: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
    shadowColor: "#ffcb05",
    shadowOffset: { width: 0, height: 0 }, // Center the shadow under the box
    shadowOpacity: 1, // Increase the visibility of the shadow
    shadowRadius: 10, // Increase the blurriness of the shadow
    elevation: 5, // This adds a drop shadow on Android and increases the "glow" effect
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
    backgroundColor: "#3c5aa6",
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
