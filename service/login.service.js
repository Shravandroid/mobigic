const userService = require("../service/user.service");
const bcrypt = require("bcryptjs");

module.exports = {
  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await userService.findUser({
        username,
      });

      if (!user) {
        const err = new Error("Invalid username or password");
        err.status = 401;
        console.log(err);
        throw err;
      }
      const isValid = bcrypt.compareSync(password, user.password);

      if(!isValid) {
        const err = new Error("Invalid username or password");
        err.status = 401;
        console.log(err);
        throw err;
      }
     const accessToken = user.getToken()
     const userData = user.toObject()
     delete userData.password
     return {accessToken, user:userData}
    } catch (error) {
         res.status(error.status).send({
          status: error.status,
          message: error.message,
        });
    }
  },
};
