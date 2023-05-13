import React from 'react';
import './config/firebase';
import { StyleSheet, Text, View, } from 'react-native';
import RootNavigation from './navigation';

export default function App() {
  return (
    <View style={styles.container}>
      <RootNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});
