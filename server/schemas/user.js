import UserModel from "../models/UserModel.js";

const typeDefs = `#graphql
    type User {
        _id: ID!
        name: String
        username: String
        email: String
        password: String
        imageUrl: String
        userFollowers: [Followers]
        userFollowing: [Followings]
    }

    type Followings {
        _id: ID!
        name: String
        username: String
        email: String
    }
    
    type Followers {
        _id: ID!
        name: String
        username: String
        email: String
    }

    type Token {
        access_token: String
    }

    type Query {
        users: [User]
        getUserByNameOrUserName(name: String): [User]
        getUserById(id: ID): User
    }

    type Mutation {
        addUser(name: String, username: String, email: String, imageUrl: String, password: String): User
        login(username: String, password: String): Token
    }
`;

const resolvers = {
    Query: {
        users: async () => {
            const users = await UserModel.findAll()
            return users;
        },
        getUserByNameOrUserName: async (_, { name }) => {
            const user = await UserModel.getUserByNameOrUserName(name)
            return user;
        },
        getUserById: async (_, { id }, contextValue) => {
            const token = await contextValue.authentication();

            const user = await UserModel.getUserDetail(id, token)
            return user;
        }
    },
    Mutation: {
        addUser: async (_, { name, username, email, password, imageUrl }) => {
            const user = await UserModel.create({ name, username, email, password, imageUrl })
            return user;
        },
        login: async (_, { username, password }) => {
            const user = await UserModel.login(username, password)
            return user;
        }
    }
}

export {
    typeDefs as userTypeDefs,
    resolvers as userResolvers
}