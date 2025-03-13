
import React, { useState } from 'react'
import { Text, View, Image, StyleSheet, ScrollView, TouchableWithoutFeedback } from 'react-native'
import InputComment from '../components/InputComment';
import { gql, useMutation, useQuery } from '@apollo/client';

const CommentItem = ({ username, content }) => (
    <View style={styles.commentContainer}>
        <Image
            source={{ uri: `https://ui-avatars.com/api/?name=${username.replace(/\s/g, '+')}&size=48` }}
            style={styles.avatar}
        />
        <View style={styles.commentContent}>
            <Text style={styles.commentUser}>{username}</Text>
            <Text style={styles.commentText}>{content}</Text>
        </View>
    </View>
)

const GET_POST_ID = gql`
query GetPostById($getPostByIdId: ID!) {
    getPostById(id: $getPostByIdId) {
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
        _id
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
        }
    }
}`;

const ADD_LIKES = gql`
        mutation Mutation($postId: ID!) {
            addLike(postId: $postId) {
                _id
                likes {
                _id
                username
                createdAt
                updatedAt
                }
        }
}`;

export default function DetailPost({ route }) {

    const { post } = route.params;
    // console.log("🚀 ~ DetailPost ~ post:", post)

    const { loading, error, data, refetch } = useQuery(GET_POST_ID, {
        variables: {
            getPostByIdId: post._id
        }
    });
    // console.log("🚀 ~ DetailPost ~ data:", data?.getPostById)

    const sampleComments = [
        { user: 'John Doe', content: 'This is amazing! Love the concept!' },
        { user: 'Jane Smith', content: 'Great perspective on parallel universes.' },
        { user: 'Mike Johnson', content: 'Mind-bending stuff! 🌌' },
        { user: 'John Doe', content: 'This is amazing! Love the concept!' },
        { user: 'Jane Smith', content: 'Great perspective on parallel universes.' },
        { user: 'Mike Johnson', content: 'Mind-bending stuff! 🌌' }
    ];

    const [liked, setLiked] = useState(post?.likes?.length);
    const [addLike, {loading: loadingLike}] = useMutation(ADD_LIKES)

    const handleLike = async () => {
        await addLike({
            variables: {
                postId: post._id
            }
        })
        setLiked(liked + 1)
    }

    return (
        <>
            <ScrollView style={styles.container}>
                <Image
                    source={{ uri: post.imgUrl }}
                    style={styles.image}
                />
                <View style={styles.contentContainer}>
                    <Text style={styles.userName}>{post.user}</Text>
                    <Text style={styles.content}>{post.content}</Text>
                    <Text style={styles.tags}>{post.tags}</Text>
                    <View style={styles.statsContainer}>
                         <TouchableWithoutFeedback
                            onPress={handleLike}>
                            <Text style={styles.stats}>❤️ {liked} likes</Text>
                        </TouchableWithoutFeedback>

                        <Text style={styles.stats}>💬 {post.comment} {data?.getPostById.comments?.length} comments</Text>
                    </View>
                </View>
                <View style={styles.commentsSection}>
                    <Text style={styles.commentsHeader}>Comments</Text>
                    {data?.getPostById?.comments.map((comment, index) => (
                        <CommentItem key={index} {...comment} />
                    ))}
                </View>
            </ScrollView>
            <InputComment refetch={refetch} postId={post._id} />
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingBottom: 20
    },
    image: {
        width: '100%',
        height: 300,
        resizeMode: 'cover',
    },
    contentContainer: {
        padding: 15,
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    content: {
        fontSize: 18,
        marginBottom: 8,
    },
    tags: {
        color: '#2196F3',
        marginBottom: 12,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    stats: {
        fontSize: 14,
        color: '#666',
    },
    commentsSection: {
        padding: 15,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    commentsHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    commentContainer: {
        flexDirection: 'row',
        marginBottom: 15,
        alignItems: 'flex-start',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    commentContent: {
        flex: 1,
    },
    commentUser: {
        fontWeight: 'bold',
        marginBottom: 4,
    },
    commentText: {
        color: '#333',
        lineHeight: 20,
    }
})
