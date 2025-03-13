
import React from 'react'
import { Image, Text, View } from 'react-native'

export default function ProfileImage({ post, userData }) {
    // console.log("🚀 ~ ProfileImage ~ post:", post)
    // console.log("🚀 ~ ProfileImage ~ userData:", userData)
    // console.log("🚀 ~ ProfileImage ~ image:", post)
    return (
        <View style={{ alignItems: "center" }}>
            <View style={{ backgroundColor: "green", borderRadius: 100, padding: 2, marginHorizontal: 15 }}>
                <Image
                    style={{ width: 45, height: 45, borderRadius: 45, borderWidth: 2, borderColor: "white" }}
                    // source={{ uri: `https://image.pollinations.ai/prompt/${post?.UserPost[0]?.username}%20500x500`}}
                    source={{ uri: userData ? userData?.imageUrl :  `https://image.pollinations.ai/prompt/randomface${post?._id}%20500x500`}}
                />
            </View>
        </View>
    )
}
