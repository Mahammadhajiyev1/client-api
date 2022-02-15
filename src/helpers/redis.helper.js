const redis = require("redis");
const client = redis.createClient(process.env.REDIS_URL);
let redisIsReady = false;

const setJWT = async (key, value) => {
  // const client = redis.createClient(process.env.REDIS_URL);
  client.on("error", (err) => {
    redisIsReady = false;
    console.log("Redis Client Error", err);
  });
  client.on("ready", function () {
    redisIsReady = true;
    console.log("redis is running");
  });
  if (!redisIsReady) {
    await client.connect();
  }

  return await client.set(key, value);
};
const getJWT = async (key) => {
  redisIsReady = true;
  client.on("error", (err) => {
    redisIsReady = false;
    console.log("Redis Client Error", err);
  });
  client.on("ready", function () {
    redisIsReady = true;
    console.log("redis is running");
  });

  if (!redisIsReady) {
    await client.connect();
  }

  return await client.get(key);
};

const deleteJWT = async (key) => {
  redisIsReady = true;
  client.on("error", (err) => {
    redisIsReady = false;
    console.log("Redis Client Error", err);
  });
  client.on("ready", function () {
    redisIsReady = true;
    console.log("redis is running");
  });

  if (!redisIsReady) {
    await client.connect();
  }

  return await client.del(key);
};

module.exports = {
  setJWT,
  getJWT,
  deleteJWT,
};
