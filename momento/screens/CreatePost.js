import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useEffect } from 'react'
import { Alert, Image, Keyboard, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import ProfileImage from '../components/ProfileImage'
import { gql, useMutation, useQuery } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';


const ADD_NEW_POSTS = gql`
mutation AddPost($content: String, $tags: [String], $imgUrl: String) {
  addPost(content: $content, tags: $tags, imgUrl: $imgUrl) {
    _id
    content
    tags
    imgUrl
    authorId
    comments {
      content
      username
      createdAt
      updatedAt
    }
    likes {
      username
      createdAt
      updatedAt
    }
    createdAt
    updatedAt
    UserPost {
      username
      name
    }
  }
}`;

const GET_PROFILE_USER = gql`
query GetUserById($getUserByIdId: ID) {
  getUserById(id: $getUserByIdId) {
    _id
    name
    username
    email
    imageUrl
    userFollowers {
      _id
    }
    userFollowing {
      _id
    }
  }
}`;

export default function CreatePost({ navigation }) {

  const [post, onChangePost] = React.useState('')
  const [imageUrl, onChangeImageUrl] = React.useState('')
  const [tags, onChangeTags] = React.useState('')
  const [addPost, { loading }] = useMutation(ADD_NEW_POSTS, {
    refetchQueries: ["PostAll"]
  })

  const { loading: loadingUser, error, data } = useQuery(GET_PROFILE_USER, {
          fetchPolicy: 'network-only',
  })
  
  //This effect use for connect the submit button to the TabNavigator
  useEffect(() => {
    navigation.setParams({
      handleSubmit: handleSubmit
    })
  }, [navigation, post])

  const handleSubmit = async () => {
    try {
      const result = await addPost({
        variables: {
          content: post,
          tags: [tags],
          imgUrl: `https://image.pollinations.ai/prompt/${imageUrl}%20500x500`
        }
      })
      onChangePost('')
      Keyboard.dismiss()
      navigation.navigate("Home")
    } catch (error) {
      Alert.alert(error.message)
    }
  }

  return (
    <View>
      <View style={{ flexDirection: "row", gap: 10, alignItems: "center", marginVertical: 20, marginHorizontal: 10 }}>
        <Image
          style={{ width: 55, height: 55, borderRadius: 100 }}
          source={{uri: data?.getUserById?.imageUrl }}
        />
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: "bold", fontSize: 20 }}>{data?.getUserById?.name}</Text>

          <View style={{ flexDirection: "row", gap: 5, alignItems: "center", justifyContent: "space-between", marginTop: 5 }}>
            <View style={{ flexDirection: "row", gap: 5, height: 32, backgroundColor: "#8298fa", paddingHorizontal: 10, borderRadius: 30, alignItems: 'center' }}>
              <Ionicons name="globe-outline" size={16} color="blue" />
              <TextInput
                      style={{ width: 90}}
                      onChangeText={onChangeTags}
                      value={tags}
                      placeholder='Tags name'
              />
            </View>

            <View style={{ flexDirection: "row", gap: 5, height: 32, alignItems: "center", marginRight: 10, backgroundColor: "#fcb1f5", paddingHorizontal: 10, borderRadius: 30, flexDirection: 'row', justifyContent: 'center', alignContent: 'center' }}>
              <Ionicons name="image-outline" size={16} color="purple" />
              {/* <Text style={{ fontWeight: "light", fontSize: 12, color: "purple" }}>Add Image</Text> */}
              <TextInput
                      style={{ width: 150}}
                      onChangeText={onChangeImageUrl}
                      value={imageUrl}
                      placeholder='Image Name'
              />
            </View>
          </View>
        </View>
      </View>

      <ScrollView style={{width: '100%', height: '100%'}}>
        <TextInput
        style={styles.input}
        onChangeText={onChangePost}
        value={post}
        placeholder="What's on your mind?"
        multiline={true}
        textAlignVertical="top"
        numberOfLines={10}
        />
      </ScrollView>
    </View>
  )
}



const styles = StyleSheet.create({
    input: {
        margin: 12,
        padding: 10,
        fontSize: 30,
        fontWeight: 'bold',
        minHeight: 100,
        textAlignVertical: 'top'
    }
});