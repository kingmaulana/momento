import { gql, useQuery } from '@apollo/client'
import { useNavigation } from '@react-navigation/native';
import React from 'react'
import { ScrollView, Text, View, StyleSheet, Image, Dimensions, FlatList, TouchableWithoutFeedback } from 'react-native'

const { width } = Dimensions.get('window');
const COLUMN_COUNT = 3;
const ITEM_WIDTH = width / COLUMN_COUNT;
const ITEM_HEIGHT = ITEM_WIDTH; // Ensuring square images

const generateDummyData = (count) => {
    return Array.from({ length: count }, (_, index) => ({
        id: String(index),
        imageUrl: `https://picsum.photos/seed/${index}/200/200`,
    }));
};

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

export default function ProfileScreen() {
    const avatarUrl = `https://image.pollinations.ai/prompt/hansome%20beard%20man20galaxy%20500x500`
    const datas = generateDummyData(10);
    // console.log("🚀 ~ ProfileScreen ~ datas:", datas)

    const { loading, error, data } = useQuery(GET_PROFILE_USER, {
        fetchPolicy: 'network-only',
    })
    // console.log("🚀 ~ ProfileScreen ~ data:", data?.getUserById?.imageUrl)
    const navigation = useNavigation()

    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
        </View>
    );

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.header}>
                    <Image source={{ uri: data?.getUserById?.imageUrl }} style={styles.avatar} />
                    <View style={styles.userInfo}>
                        <Text style={styles.name}>{data?.getUserById?.name || "Loading..."}</Text>
                        <Text style={styles.username}>@{data?.getUserById?.username || "..."}</Text>
                        <Text style={{ marginTop: 5 }}>"Life’s a comedy, but I’m stuck in the tragic backstory part. 😔🎶"</Text>
                    </View>
                </View>

                <View style={styles.statsContainer}>
                    <TouchableWithoutFeedback
                        onPress={() => {
                            // Navigate to detail screen
                            navigation.navigate('Followers');
                        }}
                    >
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>{data?.getUserById?.userFollowers?.length || 0}</Text>
                            <Text style={styles.statLabel}>Followers</Text>
                        </View>
                    </TouchableWithoutFeedback>

                    <TouchableWithoutFeedback
                        onPress={() => {
                            // Navigate to detail screen
                            navigation.navigate('Following');
                        }}>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>{data?.getUserById?.userFollowing?.length || 0}</Text>
                            <Text style={styles.statLabel}>Following</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </ScrollView>

            {/* Displaying images in a grid */}
            <FlatList
                data={datas}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                numColumns={COLUMN_COUNT}
                contentContainerStyle={styles.flatListContent}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        padding: 20,
        alignItems: 'center',
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginRight: 15,
    },
    userInfo: {
        flex: 1,
    },
    name: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    username: {
        fontSize: 16,
        color: '#666',
        marginTop: 2,
    },
    statsContainer: {
        flexDirection: 'row',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    statLabel: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    flatListContent: {
        marginTop: 10,
    },
    itemContainer: {
        width: ITEM_WIDTH,
        height: ITEM_HEIGHT,
        padding: 2,
    },
    image: {
        width: ITEM_WIDTH - 4, // Ensure it fits within the container
        height: ITEM_HEIGHT - 4,
        borderRadius: 5,
    },
})

