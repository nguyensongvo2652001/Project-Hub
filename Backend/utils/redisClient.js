const redis = require("redis");

let redisClient;

const getRedisClient = () => {
  if (!redisClient) {
    redisClient = redis.createClient({
      password: process.env.REDIS_PASSWORD,
      socket: {
        host: process.env.REDIS_CLOUD_HOST,
        port: process.env.REDIS_PORT,
      },
    });
  }

  return redisClient;
};

module.exports = { getRedisClient };
