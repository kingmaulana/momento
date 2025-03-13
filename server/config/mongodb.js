import "dotenv/config";
import { MongoClient } from 'mongodb';
const uri = process.env.KEY_MONGODB_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri);
const database = client.db('rmt-57');

export { database }