import { database } from "../config/mongodb.js";
import { ObjectId } from "mongodb";

class FollowModel {

    static collection() {
        return database.collection('follows');
    }

    static async findAll() {
        const follows = await this.collection().find().toArray();
        return follows;
    }

    static async create(newFollow, payload) {
        // Check if follow relationship already exists
        const existingFollow = await this.collection().findOne({
            followingId: new ObjectId(newFollow),
            followerId: new ObjectId(payload._id)
        });

        if (existingFollow) {
            throw new Error("You already follow this user");
        }

        const follow = await this.collection().insertOne({
            followingId: new ObjectId(newFollow),
            followerId: new ObjectId(payload._id),
            createdAt: new Date(),
            updatedAt: new Date()
        });
        const addedFollow = await this.collection().findOne({ _id: follow.insertedId });

        return {
            _id: addedFollow._id,
            followingId: newFollow,
            followerId: addedFollow.followerId,
            createdAt: addedFollow.createdAt,
            updatedAt: addedFollow.updatedAt
        };
    }
}

export default FollowModel;