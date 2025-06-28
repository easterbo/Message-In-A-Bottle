
import React from 'react';
import { View, Button, StyleSheet, Text } from 'react-native';
import { useSpotifyAuth } from '../hooks/useSpotifyAuth'; // adjust path if needed

export default function Home() {
  const { promptAsync } = useSpotifyAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to ShelfShare 🎵</Text>
      <Button title="Connect to Spotify" onPress={() => promptAsync()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    textAlign: 'center',
  },
});
