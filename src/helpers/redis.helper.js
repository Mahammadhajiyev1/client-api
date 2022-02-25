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
    console.log("redis is running setJWT");
  });
  if (!redisIsReady) {
    await client.connect();
  }
  const result = await client.set(key, value);

  return result;
};
const getJWT = async (key) => {
  client.on("error", (err) => {
    redisIsReady = false;
    console.log("Redis Client Error", err);
  });
  client.on("ready", function () {
    redisIsReady = true;
    console.log("redis is running getJWT");
  });

  if (!redisIsReady) {
    await client.connect();
  }

  const result = await client.get(key);
  console.log(result);
  return result;
};

const deleteJWT = async (key) => {
  client.on("error", (err) => {
    redisIsReady = false;
    console.log("Redis Client Error", err);
  });
  client.on("ready", function () {
    redisIsReady = true;
    console.log("redis is running deleteJWT");
  });

  if (!redisIsReady) {
    await client.connect();
  }

  const result = await client.del(key);
  return result;
};

module.exports = {
  setJWT,
  getJWT,
  deleteJWT,
};
