import React from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import { ActivityIndicator, Alert, Keyboard, TextInput, TouchableHighlight, View } from 'react-native'
import { gql, useMutation } from '@apollo/client';

const ADD_COMMENT = gql`
    mutation AddComment($postId: ID!, $content: String) {
        addComment(postId: $postId, content: $content) {
            _id
            comments {
                _id
                content
                username
                createdAt
                updatedAt
            }
        }
    }
`;

export default function InputComment({ postId, refetch }) {
    const [text, onChangeText] = React.useState('');
    const [addComment, { loading }] = useMutation(ADD_COMMENT, {
        update(cache, { data: { addComment } }) {
            // Simply replace the entire comments array with the new one from the server
            cache.modify({
                id: cache.identify({ __typename: 'Post', _id: postId }),
                fields: {
                    comments() {
                        return addComment.comments;
                    }
                }
            });
        }
    });

    const handleSubmit = async () => {
        if (!text.trim()) return;
        if (!postId) {
            Alert.alert('Error', 'Unable to add comment at this time');
            return;
        }
        try {
            const { data } = await addComment({
                variables: {
                    content: text,
                    postId: postId
                }
            });
            if (data?.addComment) {
                onChangeText("");
                Keyboard.dismiss();
                // await refetch();
            }
        } catch (error) {
            Alert.alert('Error', error.message);
            console.log("🚀 ~ handleSubmit ~ error:", error);
        }
    }

    return (
        <View style={{ margin: 10, flexDirection: "row", alignItems: "center" }}>
            <TextInput
                style={{
                    height: 40,
                    borderColor: 'gray',
                    borderWidth: 1,
                    margin: 10,
                    flex: 1,
                    padding: 10,
                    borderRadius: 8
                }}
                placeholder="Type here!"
                onChangeText={onChangeText}
                value={text}
            />
            {loading ? (
                <ActivityIndicator />
            ) : (
                <TouchableHighlight
                    onPress={handleSubmit}
                    style={{ padding: 10 }}>
                    <Ionicons name="send-outline" size={24} color="black" />
                </TouchableHighlight>
            )}
        </View>
    )
}