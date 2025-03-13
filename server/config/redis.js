import "dotenv/config";
import Redis from "ioredis";
const redisKey = process.env.KEY_REDIS_URI

const redis = new Redis({
    port: 18252, // Redis port
    host: "redis-18252.c1.ap-southeast-1-1.ec2.redns.redis-cloud.com", // Redis host
    username: "default", // needs Redis >= 6
    password: redisKey,
    db: 0, // Defaults to 0
});

export default redis;