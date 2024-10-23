const redis = require("redis");

// Tạo một Redis client
const redisClient = redis.createClient({
    url: 'redis://localhost:6379',
});

// Xử lý lỗi nếu có
redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});

// Khi kết nối thành công
redisClient.on("connect", () => {
  console.log("Connected to Redis server");
});

// Kết nối đến Redis
redisClient.connect();

module.exports = redisClient;
