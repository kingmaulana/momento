import React, { useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
    Dimensions,
    FlatList,
    Image,
    StyleSheet,
    TouchableOpacity,
    View,
    TextInput,
    Button,
    TouchableWithoutFeedback,
    Text,
    Alert,
} from 'react-native';
import { gql, useQuery } from '@apollo/client';
import UserCard from '../components/UserCard';


const SEARCH_USER = gql`
query GetUserByNameOrUserName($name: String) {
  getUserByNameOrUserName(name: $name) {
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
}`;

const { width } = Dimensions.get('window');
const COLUMN_COUNT = 3;
const ITEM_WIDTH = width / COLUMN_COUNT;
const ITEM_HEIGHT = ITEM_WIDTH;

// Generate dummy data
const generateDummyData = (count) => {
    return Array.from({ length: count }, (_, index) => ({
        id: String(index),
        imageUrl: `https://picsum.photos/seed/${index}/200/200`,
    }));
};

export default function ExploreScreen({ navigation }) {
    const [searchText, setSearchText] = useState('');
    const datas = generateDummyData(30);

    // Move useQuery to component level
    const { loading, error, data } = useQuery(SEARCH_USER, {
        variables: { name: searchText },
        skip: !searchText // Skip the query if searchText is empty
    });


    const [resultUser, setResultUser] = useState(null);

    const handleSearch = async () => {
        if (data && data.getUserByNameOrUserName && data.getUserByNameOrUserName.length > 0) {
            setResultUser(data.getUserByNameOrUserName);
            console.log("\U0001F680 ~ ExploreScreen ~ data:", data.getUserByNameOrUserName);
            console.log("🚀 ~ handleSearch ~  data.getUserByNameOrUserName:", data)
        } else if (searchText === '') {
            setResultUser(null)
        }
        else {
            Alert.alert('Error', 'User not found');
        }
    }

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => {
                // Navigate to detail screen
                navigation.navigate('PostDetail', { post: item });
            }}>
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search"
                    placeholderTextColor="#666"
                    value={searchText}
                    onChangeText={setSearchText}
                />

                <TouchableWithoutFeedback
                    onPress={handleSearch}
                >
                    <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
                </TouchableWithoutFeedback>

            </View>
            {
                resultUser ? 
                    <FlatList
                        data={resultUser}
                        renderItem={({ item }) => <UserCard data= {item} />}
                        keyExtractor={(item, index) => index}
                    />
                    // <Text>{JSON.stringify(resultUser)}</Text>
                    : <>
                        <FlatList
                            data={datas}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.id}
                            numColumns={COLUMN_COUNT}
                            contentContainerStyle={styles.flatListContent}
                        />
                    </>
            }
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
    },
    itemContainer: {
        width: ITEM_WIDTH,
        height: ITEM_HEIGHT,
        padding: 1,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EFEFEF',
        margin: 10,
        paddingHorizontal: 15,
        borderRadius: 10,
        height: 40,
        boxShadow: '0px 1px 10px rgba(0, 0, 0, 0.2)',
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
});
