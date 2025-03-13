import { gql, useMutation } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import React from 'react'
import { Alert, Button, Image, StyleSheet, Text, TextInput, View } from 'react-native'


const REGISTER_USER = gql`
mutation Adduser($name: String, $username: String, $email: String, $password: String, $imageUrl: String) {
  addUser(name: $name, username: $username, email: $email, password: $password, imageUrl: $imageUrl) {
    _id
    name
    username
    email
    password
    userFollowers {
      _id
      name
      username
      email
    }
    userFollowing {
      _id
      name
      username
      email
    }
    imageUrl
  }
}`;


export default function RegisterScreen() {
    const navigation = useNavigation();

    const [name, onChangeName] = React.useState('')
    const [username, onChangeUsername] = React.useState('')
    const [email, onChangeEmail] = React.useState('')
    const [password, onChangePassword] = React.useState('')
    const [imageUrl, onChangeImageUrl] = React.useState('')

    const [addUser, { loading }] = useMutation(REGISTER_USER)

    const handleRegister = async () => {
        console.log('OKOK');
        try {
            const result = await addUser({
                variables: {
                    name,
                    username,
                    email,
                    password,
                    imageUrl : `https://image.pollinations.ai/prompt/${imageUrl}%20300x300`
                }
            })
            onChangeName('')
            onChangeUsername('')
            onChangeEmail('')
            onChangePassword('')
            onChangeImageUrl('')
            navigation.navigate('Login')
        } catch (error) {
            Alert.alert('Error', error.message)
        }
    }

    return (
        <View style={styles.container}>
            <Image style={{width: 350, height: 80, marginBottom: 15}}
                source={require('../assets/logo.png')}
            />
            <Text style={styles.heading}>Register Account</Text>

            <TextInput
                style={styles.input}
                onChangeText={onChangeName}
                value={name}
                placeholder='name'
            />

            <TextInput
                style={styles.input}
                onChangeText={onChangeUsername}
                value={username}
                placeholder='username'
            />

            <TextInput
                style={styles.input}
                onChangeText={onChangeEmail}
                value={email}
                placeholder='email'
            />

            <TextInput
                style={styles.input}
                onChangeText={onChangeImageUrl}
                value={imageUrl}
                placeholder='description your picture'
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
                    title='Register Now'
                    onPress={handleRegister}
                />
            </View>

            <View style={styles.buttonContainer}>
                <Button 
                    color='#000000'
                    title='Login'
                    onPress={() => navigation.navigate('Login')}
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
