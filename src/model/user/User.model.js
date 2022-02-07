const { UserSchema } = require("./User.schema");

const insertUser = (userObject) => {
  return new Promise((resolve, reject) => {
    UserSchema(userObject)
      .save()
      .then((data) => resolve(data))
      .catch((error) => reject(error));
  });
};

module.exports = {
  insertUser,
};
