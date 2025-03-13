import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { 
    Image, 
    StyleSheet, 
    TextInput, 
    TouchableOpacity, 
    TouchableWithoutFeedback, 
    View,
    Text,
    FlatList,
    ActivityIndicator
} from 'react-native';
import { gql, useQuery } from '@apollo/client';

const GET_USER = gql`
    query Query($getUserByIdId: ID) {
        getUserById(id: $getUserByIdId) {
            _id
            name
            username
            email
            password
            imageUrl
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
        }
    }
`;

const UserCard = ({ user }) => (
    <TouchableOpacity style={styles.userCard}>
        <Image 
            source={{ uri: `https://ui-avatars.com/api/?name=${user.name.replace(/\s/g, '+')}&size=128` }} 
            style={styles.avatar} 
        />
        <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userUsername}>@{user.username}</Text>
        </View>
        {/* <TouchableOpacity style={styles.followButton}>
            <Text style={styles.followButtonText}>Following</Text>
        </TouchableOpacity> */}
    </TouchableOpacity>
);

export default function FollowingScreen() {
    const [searchText, setSearchText] = useState('');
    const navigation = useNavigation();

    // Replace with actual user ID
    const { loading, error, data } = useQuery(GET_USER);

    const filteredFollowing = data?.getUserById?.userFollowing.filter(user =>
        user.name.toLowerCase().includes(searchText.toLowerCase()) ||
        user.username.toLowerCase().includes(searchText.toLowerCase())
    ) || [];

    if (loading) return (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
        </View>
    );

    if (error) return (
        <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Error: {error.message}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search following"
                    placeholderTextColor="#666"
                    value={searchText}
                    onChangeText={setSearchText}
                />
                <TouchableWithoutFeedback>
                    <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
                </TouchableWithoutFeedback>
            </View>

            <FlatList
                data={filteredFollowing}
                renderItem={({ item }) => <UserCard user={item} />}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.flatListContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No following users found</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    flatListContent: {
        flexGrow: 1,
        paddingHorizontal: 16,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EFEFEF',
        margin: 10,
        paddingHorizontal: 15,
        borderRadius: 10,
        height: 40,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        height: '100%',
        fontSize: 16,
        color: '#000',
    },
    userCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#fff',
        borderRadius: 12,
        marginVertical: 6,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    userInfo: {
        flex: 1,
        marginLeft: 12,
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    },
    userUsername: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    followButton: {
        backgroundColor: '#2196F3',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    followButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 40,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
    }
});