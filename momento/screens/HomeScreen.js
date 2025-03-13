import React from 'react'
import { FlatList, RefreshControl, Text, View } from 'react-native'
import PostCard from '../components/PostCard'
import ProfileImage from '../components/ProfileImage'
import { gql, useQuery } from '@apollo/client'

const GET_POST = gql`
  query PostAll {
    posts {
      _id
      content
      tags
      imgUrl
      authorId
      comments {
        _id
        content
        username
        createdAt
        updatedAt
      }
      likes {
        _id
        username
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      UserPost {
        username
        name
        imageUrl
      }
    }
}`;

export default function HomeScreen() {

  const posts = [
    {
      "content": "The Secrets of the Universe",
      "like": 22,
      "comment": 8,
      "tags": "#Cleangy",
      "imgUrl": "https://image.pollinations.ai/prompt/book%20cover%20science%20galaxy%20500x500",
      "user": "John Doe"
    },
    {
      "content": "Exploring the Cosmos",
      "like": 35,
      "comment": 12,
      "tags": "#AstroScience",
      "imgUrl": "https://image.pollinations.ai/prompt/book%20cover%20space%20nebula%20500x500",
      "user": "Alice Smith"
    },
    {
      "content": "Quantum Realities",
      "like": 18,
      "comment": 5,
      "tags": "#QuantumWorld",
      "imgUrl": "https://image.pollinations.ai/prompt/book%20cover%20quantum%20physics%20500x500",
      "user": "Robert Johnson"
    },
    {
      "content": "Mysteries of Black Holes",
      "like": 40,
      "comment": 15,
      "tags": "#BlackHoleTheory",
      "imgUrl": "https://image.pollinations.ai/prompt/book%20cover%20black%20hole%20500x500",
      "user": "Emily Brown"
    },
    {
      "content": "The Future of AI",
      "like": 27,
      "comment": 9,
      "tags": "#AIRevolution",
      "imgUrl": "https://image.pollinations.ai/prompt/book%20cover%20artificial%20intelligence%20500x500",
      "user": "Michael White"
    },
    {
      "content": "Parallel Universes",
      "like": 30,
      "comment": 11,
      "tags": "#Multiverse",
      "imgUrl": "https://image.pollinations.ai/prompt/book%20cover%20parallel%20universe%20500x500",
      "user": "Sophia Green"
    },
    {
      "content": "The Code of Life",
      "like": 22,
      "comment": 7,
      "tags": "#Genetics",
      "imgUrl": "https://image.pollinations.ai/prompt/book%20cover%20DNA%20genetics%20500x500",
      "user": "David Lee"
    }
  ]

  const [refreshing, setRefreshing] = React.useState(false);

  const { data, loading, error, refetch } = useQuery(GET_POST);
  console.log("🚀 ~ HomeScreen ~ data:", data)
  console.log("🚀 ~ HomeScreen ~ error:", error)
  // console.log("🚀 ~ HomeScreen ~ loading:", loading)
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
      refetch().then(() => {
      setRefreshing(false);
    }).catch(error => {
      console.error("Refresh error:", error);
      setRefreshing(false);
    });
  }, []);

  return (
    <>
      <FlatList
        data={data?.posts}
        renderItem={({ item }) => <PostCard post={item} />}
        keyExtractor={(item, index) => index}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#000000"
            colors={["#000000"]} 
            title="Pull to refresh" 
            titleColor="#000000" 
          />
        }
        ListHeaderComponent={
          <FlatList
            style={{ flexDirection: 'row', marginVertical: 10 }}
            data={data?.posts}
            renderItem={({ item }) => <ProfileImage post={item} />}
            keyExtractor={(item, index) => index}
            showsHorizontalScrollIndicator={false}
            horizontal={true}
          />
        }
      />
    </>
  )
}
