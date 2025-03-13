
import React from 'react'
import { Alert, Text, TouchableWithoutFeedback, View } from 'react-native'
import ProfileImage from './ProfileImage'
import { gql, useMutation } from '@apollo/client'

const FOLLOW_USER = gql`
    mutation AddFollow($followingId: ID!) {
    addFollow(followingId: $followingId) {
        _id
        followingId
        followerId
        createdAt
        updatedAt
    }
}`

export default function UserCard({ data }) {
// console.log("🚀 ~ UserCard ~ data:", data)

    const [addFollower, { laoding }] = useMutation(FOLLOW_USER)

    const handleFollow = async () => {
        console.log('Follow clicked');
        try {
            const result = await addFollower({
                variables: {
                    followingId: data._id
                }
            })
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    }
    return (
        <View style={{ boxShadow: '0px 2px 7px rgba(0, 0, 0, 0.2)', margin: 10, padding: 10, borderRadius: 10, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: "row", alignItems: 'center', flex: 1 }}>
                <ProfileImage userData = {data}/>

                <View style={{ marginRight: 'auto' }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{data?.username}</Text>
                    <Text style={{ fontSize: 12 }}>{data?.name}</Text>
                </View>

                <TouchableWithoutFeedback
                    onPress={handleFollow}
                >
                    <View style={{ backgroundColor: '#000', padding: 5, borderRadius: 5, marginLeft: 10, alignItems: 'center' }}>
                        <Text style={{ color: 'white' }}>Follow</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        </View>
    )
}
