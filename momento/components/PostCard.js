import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Button, FlatList, Image, Text, TouchableHighlight, TouchableNativeFeedback, TouchableWithoutFeedback, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import ProfileImage from './ProfileImage';
import { gql, useMutation } from '@apollo/client';

const ADD_LIKES = gql`
        mutation Mutation($postId: ID!) {
            addLike(postId: $postId) {
                _id
                likes {
                username
                createdAt
                updatedAt
                }
        }
}`;

export default function PostCard({ post }) {

    const navigation = useNavigation();
    const [liked, setLiked] = useState(post?.likes?.length);
    const [addLike, {loading}] = useMutation(ADD_LIKES)

    const handleLike = async () => {
        await addLike({
            variables: {
                postId: post._id
            }
        })
        setLiked(liked + 1)
    }

    return (
        <TouchableWithoutFeedback onPress={() => navigation.navigate('DetailPost', { post })}>
        <View style={{
            flexDirection: "row",
            gap: 10,
            backgroundColor: 'white',
            padding: 8,
            borderRadius: 8,
            marginBottom: 8,
            marginHorizontal: 4,
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
        }}>
            
            <View style={{ flex: 1, justifyContent: "space-between", gap: 5, padding: 15 }} >
                <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
                    <Image
                        style={{ width: 35, height: 35, borderRadius: 100 }}
                        source= {{ 
                            uri: post?.UserPost[0]?.imageUrl
                        }}
                    />

                    <View>
                    <Text style={{ fontWeight: "bold", fontSize: 15 }}>{post?.UserPost[0]?.name}</Text>
                    <Text style={{ fontSize: 12 }}>@{post?.UserPost[0]?.username}</Text>
                    </View>
                    <Ionicons style={{marginLeft: 'auto'}} name="ellipsis-horizontal-outline" size={24} color="gray" />

                </View>

                <Image
                    style={{ width: 350, height: 180, borderRadius: 8 }}
                    source={{
                        uri: post.imgUrl,
                    }}
                />
                <Text style={{ fontWeight: "bold", fontSize: 16 }}>{post.content}</Text>
                <Text style={{ fontSize: 12, color: 'blue' }}>#{post.tags}</Text>


                <View style={{ flexDirection: "row", gap: 10}}>
                    <View style={{ flexDirection: "row", gap: 10 }}>
                    
                    <TouchableWithoutFeedback
                        onPress={handleLike}
                    >
                        <Ionicons name="heart" size={24} color="red" />
                    </TouchableWithoutFeedback>
                    <Text>{liked} likes</Text>

                    <Ionicons name="chatbox-outline" size={24} color="gray" />
                    <Text>{post?.comments?.length} comments</Text>
                    </View>

                    <View style={{marginLeft: "auto"}} >
                    <Ionicons name="bookmarks-outline" size={24} color="gray" />
                    </View>
                </View>

            </View>
        </View>
        </TouchableWithoutFeedback>
    )
}
