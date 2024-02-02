const express = require("express");
const inventoryService = require("../service/inventory.service");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const { auth } = require("../utils/auth");

const path = "uploads/inventory";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, { recursive: true });
    }
    cb(null, path);
  },
  filename: function (req, file, cb) {
    const fileExtension = file.originalname.split(".").at(-1);
    const uniqueSuffix = Date.now() + "." + fileExtension;
    req.body.path = `/${path}/${uniqueSuffix}`;
    req.body.fileName = `${uniqueSuffix}`;
    cb(null, uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

const { z } = require("zod");
const validate = require("../utils/commonSchemaValidation");

const inventoryValidationSchema = z.object({
  body: z.object({
    fileName: z.string({
      required_error: "filename is required",
    }),
    path: z.string({
      required_error: "path is required",
    }),
  }),
});

router.post(
  "/",
  upload.single("file"),
  validate(inventoryValidationSchema),
  async (req, res, next) => {
    try {
      const inventory = await inventoryService.create(req, res);
      return res.status(201).send({ data: inventory ,message:"File uploaded successfully!", status: 201});
    } catch (error) {
      return res.status(error?.status).send(error);
    }
  }
);

router.post("/check-code", async (req, res, next) => {
  try {
    const checkCode = await inventoryService.checkCode(req, res);
    return res.status(200).send({ isCodeValid: checkCode });
  } catch (error) {
    return res.status(error?.status).send(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const deletedFile = await inventoryService.delete(req, res);
    return res.status(200).send({ data: deletedFile });
  } catch (error) {
    return res.status(error?.status || 500).send(error);
  }
});

router.get("/", auth, async (req, res, next) => {
  try {
    const userId = req.userId;

    const inventory = await inventoryService.getInventoryByUserId(userId);

    return res.status(200).send(inventory);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
});

module.exports = router;
