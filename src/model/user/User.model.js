const { reject } = require("bcrypt/promises");
const { response } = require("express");
const { UserSchema } = require("./User.schema");

const insertUser = (userObject) => {
  return new Promise((resolve, reject) => {
    UserSchema(userObject)
      .save()
      .then((data) => resolve(data))
      .catch((error) => reject(error));
  });
};

const getUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    if (!email) return false;
    try {
      UserSchema.findOne({ email }, (error, data) => {
        if (error) {
          reject(error);
        }
        resolve(data);
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  insertUser,
  getUserByEmail,
};
