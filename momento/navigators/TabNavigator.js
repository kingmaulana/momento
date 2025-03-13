import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons'
import HomeScreen from '../screens/HomeScreen';
import ExploreScreen from '../screens/ExploreScreen';
import ReelScreen from '../screens/ReelScreen';
import DmScreen from '../screens/DmScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CreatePost from '../screens/CreatePost';
import { Button, View, Image } from 'react-native';
import DetailPost from '../screens/DetailPost';

import { deleteSecure } from '../helpers/secureStore';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {

  const {setIsSignedIn} = useContext(AuthContext)

  return (
    <Tab.Navigator screenOptions={
        ({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              // Ini logic buat tenttuin icon di tab bar
              if (route.name === 'Home') {
                iconName = focused
                  ? 'home'
                  : 'home-outline';
              } else if (route.name === 'Profile') {
                iconName = focused ? 'person' : 'person-outline';
              } else if (route.name === 'Explore') {
                iconName = focused ? 'baseball' : 'baseball-outline';
              } else if (route.name === 'Create') {
                iconName = focused ? 'add-circle' : 'add-circle';
              } else if (route.name === 'Dm') {
                iconName = focused ? 'chatbox-ellipses' : 'chatbox-ellipses-outline';
              }

              // You can return any component that you like here!
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: 'black',
            tabBarInactiveTintColor: 'gray',
        })
    }>
        <Tab.Screen name='Home' component={HomeScreen} options={{
        headerTitleAlign: 'center',
        headerTitle: () => <Image source={require('../assets/logo-nobg.png')} style={{ height: 120, width: 200, resizeMode: 'contain' }} />
        }} />
        <Tab.Screen name='Explore' component={ExploreScreen} />

        <Tab.Screen name='Create' component={CreatePost}
        options={({ navigation, route }) => ({
          title: 'Create Post',
          headerRight: () => {
          return (
            <View style={{ marginRight: 15}}>
              <Button
              title='Post'
              color={'black'}
              onPress={() => {
                if(route.params?.handleSubmit) {
                  route.params.handleSubmit()
                }
              }}
              />
            </View>
          )
        }})}
        />

        <Tab.Screen name='Dm' component={DmScreen} />
        <Tab.Screen name='Profile' component={ProfileScreen}
          options={{headerRight: () => {
            return (
              <View style={{ marginRight: 10, backgroundColor: 'black', paddingHorizontal: 10, borderRadius: 5 }}>
                <Button
                title='Logout'
                color={'black'}
                onPress={ async () => {
                  await deleteSecure('accessToken')
                  setIsSignedIn(false)
                }}
                />
              </View>
            )
          }}}
        />
    </Tab.Navigator>
  )
}
