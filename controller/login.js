const express = require("express");
const router = express.Router();

const { z } = require("zod");
const loginService = require("../service/login.service");
const validate = require("../utils/commonSchemaValidation");

const loginValidationSchema = z.object({
  body: z.object({
    username: z.string({
      required_error: "Username is required",
    }),
    password: z.string({
      required_error: "Password is required",
    }),
  }),
});

router.post("/", validate(loginValidationSchema), async (req, res, next) => {
  try {
    const authenticateUser = await loginService.login(req, res);
    return res.status(201).send(authenticateUser);
  } catch (error) {
    
    return res.status(error.status).send(error);
  }
});
module.exports = router;
