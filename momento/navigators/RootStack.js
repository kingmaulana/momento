import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RegisterScreen from '../screens/RegisterScreen';
import LoginScreen from '../screens/LoginScreen';
import TabNavigator from './TabNavigator';
import DetailPost from '../screens/DetailPost';
import { AuthContext } from '../contexts/AuthContext';
import { useContext, useEffect, useState } from 'react';
import { getSecure } from '../helpers/secureStore';
import FollowersScreen from '../screens/FollowersScreen';
import FollowingScreen from '../screens/FollowingScreen';
import { ActivityIndicator, Image, View } from 'react-native';

const Stack = createNativeStackNavigator();

export default function RootStack() {

  const { isSignedIn, setIsSignedIn } = useContext(AuthContext)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkToken() {
      try {
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 5000)
        );
        const token = await Promise.race([
          getSecure('accessToken'),
          timeoutPromise
        ]);

        if (token) {
          setIsSignedIn(true)
        } else {
          setIsSignedIn(false)
        }
      } catch (error) {
        console.log("🚀 ~ checkToken ~ error:", error)
        setIsSignedIn(false)
      } finally {
        setLoading(false)  // Move this here to ensure it runs in all cases
      }
    }
    checkToken()
  }, [])

  if(loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center',}}>
        <Image style={{width: 450, height: 120}}
          source={ require('../assets/logo.png') }
        />
      </View>
    )
  }


  return (
    <Stack.Navigator>
      {
        isSignedIn ? <>
          <Stack.Screen name='Home' component={TabNavigator} options={{ headerShown: false }} />
          <Stack.Screen name='DetailPost' component={DetailPost} options={{ title: 'Detail Post' }} />
          <Stack.Screen name='Followers' component={FollowersScreen} options={{ title: 'Followers' }} />
          <Stack.Screen name='Following' component={FollowingScreen} options={{ title: 'Following' }} />
        </> : <>
          <Stack.Screen name='Login' component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name='Register' component={RegisterScreen} options={{ headerShown: false }} />
        </>
      }
    </Stack.Navigator>
  )
}
