import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';

const App = () => {
  const [cep, setCep] = useState('');
  const [cepData, setCepData] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [registered, setRegistered] = useState(false);
  const [location, setLocation] = useState(null);
  const [marker2] = useState({ latitude: -23.5505, longitude: -46.6333 }); // Coordenadas de São Paulo

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão de localização não concedida', 'Por favor, conceda permissão de localização para obter a localização.');
        return;
      }
      let locationData = await Location.getCurrentPositionAsync({});
      setLocation(locationData);
    })();
  }, []);

  const handleCepSearch = async () => {
    if (cep.trim() === '') {
      Alert.alert('Aviso', 'Por favor, insira um CEP válido.');
      return;
    }
    try {
      const apiUrl = `https://viacep.com.br/ws/${cep}/json/`;
      const response = await axios.get(apiUrl);
      const data = response.data;
      if (!data.erro) {
        setCepData(data);
      } else {
        Alert.alert('Erro', 'CEP não encontrado. Verifique o CEP e tente novamente.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Houve um problema na busca do CEP. Tente novamente mais tarde.');
    }
  };

  const handleRegister = () => {
    if (name.trim() === '' || email.trim() === '') {
      Alert.alert('Aviso', 'Por favor, preencha todos os campos do cadastro.');
      return;
    }
    setRegistered(true);
    Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Busca de CEP</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o CEP"
        value={cep}
        onChangeText={(text) => setCep(text)}
        keyboardType="numeric"
      />
      <Button title="Buscar CEP" onPress={handleCepSearch} />
      {cepData && (
        <View style={styles.cepContainer}>
          <Text style={styles.cepTitle}>Informações do CEP</Text>
          <Text>Logradouro: {cepData.logradouro}</Text>
          <Text>Bairro: {cepData.bairro}</Text>
          <Text>Cidade: {cepData.localidade}</Text>
          <Text>Estado: {cepData.uf}</Text>
        </View>
      )}
      <Text style={styles.header}>Cadastro</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={name}
        onChangeText={(text) => setName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        keyboardType="email-address"
      />
      <Button title="Cadastrar" onPress={handleRegister} />
      {registered && (
        <View style={styles.registeredContainer}>
          <Text style={styles.successMessage}>Cadastro realizado com sucesso!</Text>
          <Text>Nome: {name}</Text>
          <Text>Email: {email}</Text>
        </View>
      )}
      {location && (
        <View style={styles.locationContainer}>
          <Text style={styles.locationHeader}>Sua Localização</Text>
          <Text>Latitude: {location.coords.latitude}</Text>
          <Text>Longitude: {location.coords.longitude}</Text>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: (location.coords.latitude + marker2.latitude) / 2,
              longitude: (location.coords.longitude + marker2.longitude) / 2,
              latitudeDelta: Math.abs(location.coords.latitude - marker2.latitude) + 0.1,
              longitudeDelta: Math.abs(location.coords.longitude - marker2.longitude) + 0.1,
            }}
          >
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="Sua Localização"
            />
          </MapView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
    marginVertical: 20,
  },
  input: {
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
    borderRadius: 5,
  },
  cepContainer: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  cepTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  registeredContainer: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#4caf50',
    borderRadius: 5,
    backgroundColor: '#e8f5e9',
  },
  successMessage: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4caf50',
    marginBottom: 10,
    textAlign: 'center',
  },
  locationContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  locationHeader: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  map: {
    width: '100%',
    height: 300,
    marginTop: 10,
  },
});

export default App;
