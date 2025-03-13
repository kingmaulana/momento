

import { useNavigation } from '@react-navigation/native';
import React, { useContext } from 'react'
import { Alert, Button, Image, StyleSheet, Text, TextInput, View } from 'react-native'
import { AuthContext } from '../contexts/AuthContext';
import { gql, useMutation } from '@apollo/client';
import { saveSecure } from '../helpers/secureStore';

const LOGIN = gql`
    mutation Login($username: String, $password: String) {
      login(username: $username, password: $password) {
        access_token
      }
}`

export default function LoginScreen() {
  const navigation = useNavigation();
  const { setIsSignedIn } = useContext(AuthContext)
  const [username, onChangeUsername] = React.useState('')
  const [password, onChangePassword] = React.useState('')
  const [doLogin, { loading }] = useMutation(LOGIN)

  const submitLogin = async () => {
    try {
      const result = await doLogin({
        variables: {
          username,
          password
        }
      })
      const access_token = result.data.login.access_token
      await saveSecure('accessToken', access_token)
      setIsSignedIn(true)
    } catch (error) {
      Alert.alert('Error', error.message)
    }
  }

  return (
    <View style={styles.container}>

      <Image style={{width: 350, height: 80, marginBottom: 15}}
                      source={require('../assets/logo.png')}
      />

      <Text style={styles.heading}>Sign in Account</Text>

      <TextInput
        style={styles.input}
        onChangeText={onChangeUsername}
        value={username}
        placeholder='email or username'
      />

      <TextInput
        style={styles.input}
        onChangeText={onChangePassword}
        value={password}
        placeholder='password'
        secureTextEntry
      />

      <View style={styles.buttonContainer}>
        <Button
          color='#000000'
          title='Login'
          onPress={submitLogin}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          color='#000'
          title='To Register'
          onPress={() => navigation.navigate('Register')}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    width: '60%',
    margin: 12,
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonContainer: {
    width: '60%',
    marginTop: 10,
  }
});

