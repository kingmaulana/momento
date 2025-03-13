import { database } from "../config/mongodb.js";
import validator from "validator";
import { comparePassword, hashPassword } from "../helpers/bcrypt.js";
import { signToken, verifyToken } from "../helpers/jwt.js";
import { ObjectId } from "mongodb";

class UserModel {

    static collection() {
        return database.collection('users');
    }

    static async findAll() {
        const users = await this.collection().find().toArray(); 
        return users;
    }

    static async create(newUser) {
    // console.log("🚀 ~ UserModel ~ create ~ newUser:", newUser)

        const emailFormat = validator.isEmail(newUser.email);
        if(!emailFormat) {
            throw new Error('Email is not valid');
        }

        if(newUser.password.length < 5) {
            throw new Error('Password must be at least 5 characters');
        }
        
        const isEmailUniq = await this.collection().findOne({ email: newUser.email });
        if(isEmailUniq) {
            throw new Error('Email already exists');
        }

        const isUsernameUniq = await this.collection().findOne({ username: newUser.username });
        if(isUsernameUniq) {
            throw new Error('Username already exists');
        }

        const passwordHashed = await hashPassword(newUser.password)
        const inserteduser = await this.collection().insertOne({
            name: newUser.name,
            username: newUser.username,
            email: newUser.email,
            imageUrl: newUser.imageUrl,
            password: passwordHashed,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        const userAdded = await this.collection().findOne({ _id: inserteduser.insertedId });
        // console.log("🚀 ~ UserModel ~ create ~ userAdded:", userAdded)
        return {
            _id: inserteduser.insertedId,
            username: newUser.username,
            password: passwordHashed,
            email: userAdded.email,
            imageUrl: userAdded.imageUrl,
            name: userAdded.name,
            createdAt: userAdded.createdAt,
            updatedAt: userAdded.updatedAt
        }
    } 

    static async login(username, password) {
        const user = await this.collection().findOne({ username });
        if(!user) {
            throw new Error('User not found');
        }

        const valid = await comparePassword(password, user.password);
        if(!valid) {
            throw new Error('Password is incorrect');
        }

        const payload = { 
            _id: user._id,
            username: user.username,
         };

         const token = signToken(payload);

        return {
            access_token: token
        };
    }

    static async getUserByNameOrUserName(name) {
        if (!name) return null; // Prevent empty queries

        const query = { $or: [{ name: { $regex: String(name), $options: 'i' } },
            { username: { $regex: String(name), $options: 'i' } }
        ] };
        // console.log("🚀 ~ UserModel ~ getUserByNameOrUserName ~ query:", query)
    
        if (query.$or.length === 0) return null; // Prevent invalid MongoDB queries
    
        const user = await this.collection().find(query).toArray();
        // console.log("🚀 ~ UserModel ~ getUserByNameOrUserName ~ user:", user)
        return user;
    }

    static async getUserDetail(id, token) {
        console.log("🚀 ~ UserModel ~ getUserDetail ~ token:", token)
        const userResult = await this.collection()
        .aggregate([
            {
                $match: { _id: new ObjectId(token._id) }
            },
            {
                $lookup: {
                    from: "follows",
                    localField: "_id",
                    foreignField: "followingId",
                    as: "followers"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "followers.followerId",
                    foreignField: "_id",
                    as: "userFollowers",
                },
            },
            {
                $lookup: {
                    from: "follows",
                    localField: "_id",
                    foreignField: "followerId",
                    as: "followings",
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "followings.followingId",
                    foreignField: "_id",
                    as: "userFollowing",
                },
            },
        ])
        .toArray()
        return userResult[0];
    }

}

export default UserModel;