import FollowModel from "../models/FollowModel.js";


const typeDefs = `#graphql 
    type Follow {
        _id: ID!
        followingId: ID
        followerId: ID
        createdAt: String
        updatedAt: String
    }

    type Query {
        follows: [Follow]
    }

    type Mutation {
        addFollow(followingId: ID!): Follow
    }
`;

const resolvers = {
    Query: {
        follows: async () => {
            const follows = await FollowModel.findAll()
            return follows;
        }
    },
    Mutation: {
        addFollow: async (_, { followingId }, contextValue) => {
            const payload = await contextValue.authentication();
            const follow = await FollowModel.create(followingId, payload)
            return follow;
        }
    }
}

export {
    typeDefs as followTypeDefs,
    resolvers as followResolvers
}