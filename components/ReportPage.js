import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function ReportPage({ route }) {
  const { serverResponse } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Server Response:</Text>
      <Text style={styles.text}>{JSON.stringify(serverResponse, null, 2)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
  },
});