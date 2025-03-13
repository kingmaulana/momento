import redis from "../config/redis.js";
import PostsModel from "../models/PostsModel.js";

const typeDefs = `#graphql
    type Post {
        _id: ID!
        content: String
        tags: [String]
        imgUrl: String
        authorId: ID
        comments: [Comments]
        likes: [Likes]
        createdAt: String
        updatedAt: String
        UserPost: [UserPost]
    }

    type UserPost {
        username: String
        name: String
        imageUrl: String
    }

    type Comments {
        _id: ID
        content: String
        username: String
        createdAt: String
        updatedAt: String
    }

    type Likes {
        _id: ID
        username: String
        createdAt: String
        updatedAt: String
    }

    type Query {
        posts: [Post]
        getPostById(id: ID!): Post
    }

    type Mutation {
        addPost(content: String, tags: [String], imgUrl: String): Post
        addComment(postId: ID!, content: String): Post
        addLike(postId: ID!, username: String) : Post
    }
`;

const resolvers = {
    Query: {
        posts: async (_, __, contextValue) => {
            await contextValue.authentication();

            //Implement redis cache
            const redisPost = await redis.get("posts") 
            if(redisPost) {
                return JSON.parse(redisPost)
            } else {
                const posts = await PostsModel.findAll()
                await redis.set("posts", JSON.stringify(posts))
                return posts;
            }
        },
        getPostById: async (_, { id }, contextValue) => {
            // await contextValue.authentication();
            const posts = await PostsModel.findById(id)
            return posts;
        }
    },
    Mutation: {
        addPost: async (_, { content, tags, imgUrl }, contextValue) => {
            const { _id } = await contextValue.authentication();

            //Invalidate redis, make cache deleted
            await redis.del("posts")

            const post = await PostsModel.create({ content, tags, imgUrl, _id })
            return post;
        },
        addComment: async (_, { postId, content }, contextValue) => {
            const { _id } = await contextValue.authentication();
            const postComment = await PostsModel.addComment({ postId, content, _id })
            return postComment;
        },
        addLike: async (_, { postId }, contextValue) => {
            const { _id } = await contextValue.authentication();
            await redis.del("posts")
            const postLike = await PostsModel.addLike({ postId, _id });
            return postLike;
        }
        
    }
}

export {
    typeDefs as postsTypeDefs,
    resolvers as postsResolvers
}