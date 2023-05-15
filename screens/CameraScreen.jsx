import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Modal,
  Image,
  Button,
} from "react-native";
import { Camera } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";

export default function CameraScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [open, setOpen] = useState(false);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      const options = { quality: 0.5, base64: true };
      const data = await cameraRef.current.takePictureAsync(options);

      const boxWidth = 1400;
      const boxHeight = 1650;
      const boxX = 300;
      const boxY = 1300;

      // Use expo-image-manipulator to crop the image
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        data.uri,
        [
          {
            crop: {
              originX: boxX,
              originY: boxY,
              width: boxWidth,
              height: boxHeight,
            },
          },
        ],
        { compress: 1, format: ImageManipulator.SaveFormat.PNG }
      );

      setCapturedPhoto(manipulatedImage.uri);
      setOpen(true);
      console.log(manipulatedImage.uri);
    }
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      {/* <Camera
        style={{ flex: 1 }}
        type={Camera.Constants.Type.back}
        ref={cameraRef}
      >
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderColor: "red",
            borderWidth: 2,
            borderStyle: "dashed",
            borderRadius: 1,
            marginHorizontal: 80,
            marginVertical: 260,
          }}
        />

        <View
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "flex-end",
          }}
        >
          <TouchableOpacity
            onPress={takePicture}
            style={{
              alignSelf: "center",
              alignItems: "center",
              backgroundColor: "lightgray",
              width: 70,
              height: 70,
              borderRadius: 50,
              marginBottom: 70,
              opacity: 0.7,
            }}
          ></TouchableOpacity>
        </View>
      </Camera>

      {capturedPhoto && (
        <Modal animationType="slide" transparent={false} visible={open}>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#D7853F",
            }}
          >
            <Button title="Close Preview" onPress={() => setOpen(false)} />

            <Image
              style={{ width: 500, height: 700, borderRadius: 20 }}
              source={{ uri: capturedPhoto }}
              resizeMode="contain"
            />
          </View>
        </Modal>
      )} */}
    </View>
  );
}
