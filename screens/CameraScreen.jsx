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
      setCapturedPhoto(data.uri);
      setOpen(true);
      console.log(data.uri);
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
      <Camera
        style={{ flex: 1 }}
        type={Camera.Constants.Type.back}
        ref={cameraRef}
      >
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
      )}
    </View>
  );
}