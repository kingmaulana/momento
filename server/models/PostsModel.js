import { database } from "../config/mongodb.js";
import { ObjectId } from "mongodb";

class PostsModel {

    static collection() {
        return database.collection('posts');
    }

    static collectionUser() {
        return database.collection('users');
    }

    static async findAll() {
        console.log("🚀 ~ PostsModel ~ findAll ~ findAll:")
        const posts = await this.collection()
            .aggregate([
                {
                    $lookup: {
                        from: 'users',
                        localField: 'authorId',
                        foreignField: '_id',
                        as: 'UserPost'
                    }
                }, 
                {
                    $sort: {
                        createdAt: -1
                    }
                }
            ])
            .toArray()

        console.log("🚀 ~ PostsModel ~ findAll ~ posts:", posts)
        // const posts = await this.collection().find().toArray();
        return posts;
    }

    static async findById(id) {
        // console.log("🚀 ~ PostsModel ~ findById ~ post:", post)
        const posts = await this.collection()
            .aggregate([
                {
                    $match:
                      {
                        _id: new ObjectId(id)
                      }
                  },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'authorId',
                        foreignField: '_id',
                        as: 'UserPost'
                    }
                }
            ])
            .toArray()
        // console.log("🚀 ~ PostsModel ~ findAll ~ posts:", posts)
        // const posts = await this.collection().find().toArray();
        return posts[0];
    }

    static async create(newPost) {

        const post = await this.collection().insertOne({
            content: newPost.content,
            tags: newPost.tags,
            imgUrl: newPost.imgUrl,
            authorId: new ObjectId(newPost._id),
            comments: [],
            likes: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        // console.log("🚀 ~ PostsModel ~ addedPost ~ addedPost:", addedPost)
        const postAdded = await this.collection().findOne({ _id: post.insertedId });

        return postAdded;
    }

    static async addComment(args) {
        console.log("🚀 ~ PostsModel ~ addComment ~ args:", args)
        const post = await this.collection().findOne({ _id: new ObjectId(args.postId) });

        if (!post) {
            throw new Error('Post not found');
        }

        const user = await this.collectionUser().findOne({ _id: new ObjectId(args._id) });

        if(!user) {
            throw new Error('User not found');
        }
        // console.log("🚀 ~ PostsModel ~ addComment ~ username:", username)

        const comment = {
            _id: new ObjectId(),
            content: args.content,
            username: user?.username || 'Anonymous',
            createdAt: new Date(),
            updatedAt: new Date()
        }

        await this.collection().updateOne(
            { _id: new ObjectId(args.postId) },
            { $push: { comments: comment } }
        )

        return await this.collection().findOne({ _id: new ObjectId(args.postId) });
    }

    static async addLike(args) {
        const post = await this.collection().findOne({ _id: new ObjectId(args.postId) })
    
        console.log("🚀 ~ PostsModel ~ addLike ~ post:", post)
        if(!post) {
            throw new Error ('Post not found')
        }
    
        const user = await this.collectionUser().findOne({ _id: new ObjectId(args._id) });
    
        console.log("🚀 ~ PostsModel ~ addLike ~ user:", user)
        if(!user) {
            throw new Error('User not found');
        }
    
        // Check if user has already liked the post
        const existingLike = post.likes.find(like => like.username === user.username);
        
        if (existingLike) {
            // If user already liked, remove the like (toggle functionality)
            await this.collection().updateOne(
                { _id: new ObjectId(args.postId) },
                { $pull: { likes: { username: user.username } } }
            )
        } else {
            // If user hasn't liked, add the like
            const like = {
                _id: new ObjectId(),
                username: user?.username || 'Anonymous',
                createdAt: new Date(),
                updatedAt: new Date()
            }
    
            await this.collection().updateOne(
                { _id: new ObjectId(args.postId) },
                { $push: { likes: like } }
            )
        }
    
        return await this.collection().findOne({ _id: new ObjectId(args.postId) })
    }


}

export default PostsModel;