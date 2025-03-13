import 'dotenv/config';
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { userResolvers, userTypeDefs } from "./schemas/user.js";
import { postsResolvers, postsTypeDefs } from "./schemas/posts.js";
import { followResolvers, followTypeDefs } from "./schemas/follow.js";
import { verifyToken } from "./helpers/jwt.js";

const server = new ApolloServer({
    typeDefs : [userTypeDefs, postsTypeDefs, followTypeDefs],
    resolvers : [userResolvers, postsResolvers, followResolvers],
    introspection: true,
})

const { url } = await startStandaloneServer(server, {
    listen: { port: process.env.PORT || 4002 },
    context: async ({ req }) => {
        return {
            authentication: async () => {
                // console.log("Tes auth jalan apa engga");

                const access_token = req.headers.authorization || "";
                if(!access_token) {
                    throw new Error("Invalid token");
                }

                const [type, token] = access_token.split(" ");
                if(type !== "Bearer") {
                    throw new Error("Authentication token must be Bearer");
                }

                if(!token) {
                    throw new Error("Auth fail token must be provided");
                }

                const payload = verifyToken(token);
                return payload;
            }
        }
    }
});






