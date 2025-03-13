import React, { useState } from 'react';
import {
View,
Text,
FlatList,
TextInput,
TouchableOpacity,
Image,
StyleSheet,
SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const DUMMY_CONVERSATIONS = [
{
    id: '1',
    username: 'john_doe',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    lastMessage: 'Hey, how are you doing?',
    timestamp: '2h ago',
    unread: true,
},
{
    id: '2',
    username: 'sarah.smith',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    lastMessage: 'The photos look great! 📸',
    timestamp: '3h ago',
    unread: false,
},
{
    id: '3',
    username: 'mike_wilson',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    lastMessage: 'Let\'s catch up soon!',
    timestamp: '5h ago',
    unread: true,
},
{
    id: '4',
    username: 'emma_watson',
    avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
    lastMessage: 'Thanks for the help!',
    timestamp: '1d ago',
    unread: false,
},
];

export default function DmScreen({ navigation }) {
const [searchQuery, setSearchQuery] = useState('');

const renderConversationItem = ({ item }) => (
    <TouchableOpacity
    style={styles.conversationItem}
    onPress={() => navigation.navigate('ChatDetails', { conversation: item })}
    >
    <Image source={{ uri: item.avatar }} style={styles.avatar} />
    <View style={styles.conversationContent}>
        <View style={styles.conversationHeader}>
        <Text style={styles.username}>{item.username}</Text>
        <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
        <View style={styles.messagePreview}>
        <Text style={[styles.lastMessage, !item.unread && styles.readMessage]} numberOfLines={1}>
            {item.lastMessage}
        </Text>
        {item.unread && <View style={styles.unreadDot} />}
        </View>
    </View>
    </TouchableOpacity>
);

return (
    <SafeAreaView style={styles.container}>
    <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
        style={styles.searchInput}
        placeholder="Search"
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholderTextColor="#999"
        />
    </View>
    <FlatList
        data={DUMMY_CONVERSATIONS}
        renderItem={renderConversationItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
    />
    </SafeAreaView>
);
}

const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: '#fff',
},
searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f0f0f0',
    margin: 10,
    borderRadius: 10,
},
searchIcon: {
    marginRight: 10,
},
searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
},
conversationItem: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
},
avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 15,
},
conversationContent: {
    flex: 1,
},
conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
},
username: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
},
timestamp: {
    fontSize: 14,
    color: '#999',
},
messagePreview: {
    flexDirection: 'row',
    alignItems: 'center',
},
lastMessage: {
    fontSize: 15,
    color: '#000',
    flex: 1,
},
readMessage: {
    color: '#999',
},
unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0095f6',
    marginLeft: 8,
},
});
