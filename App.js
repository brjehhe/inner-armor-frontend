import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { API_URL } from './config';

export default function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/webhook`)
      .then(res => res.text())
      .then(data => setMessage(data))
      .catch(err => setMessage('Error: ' + err.message));
  }, []);

  return (
    <View style={styles.container}>
      <Text>{message || 'Loading...'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
