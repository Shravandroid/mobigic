const express = require("express");
const userService = require("../service/user.service");
const router = express.Router();

const { z } = require("zod");
const validate = require("../utils/commonSchemaValidation");

const userValidationSchema = z.object({
  body: z.object({
    firstName: z.string({
      required_error: "First name is required",
    }),
    lastName: z.string({
      required_error: "Last name is required",
    }),
    username: z.string({
      required_error: "Username is required",
    }),
    password: z.string({
      required_error: "Password is required",
    }),
    confirmPassword: z.string({
      required_error: "Confirm password is required",
    }),
  }),
});

router.get("/", async (req, res, next) => {
  try {
    const users = await userService.getAllUsers(req);
    return res.status(200).send(users);
  } catch (error) {
    console.log(error);
  }
});

router.post("/", validate(userValidationSchema), async (req, res, next) => {
  try {
    const { firstName, lastName, username, password, confirmPassword } =
      req.body;
    const user = await userService.findUser({ username });
    if (user) {
      const error = new Error();
      error.status = 400;
      error.message = "User already exists";
      throw error;
    }
    const createdUser = await userService.createUser({
      firstName,
      lastName,
      username,
      password,
      confirmPassword,
    });

    return res.status(201).send(createdUser);
  } catch (error) {
    return res.status(error.status).send(error);
  }
});
module.exports = router;
