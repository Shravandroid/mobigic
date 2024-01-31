const InventoryModel = require("../models/inventory.model");
const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");
const fs = require("fs");
module.exports = {
  async create(req, res) {
    try {
      const code = await this.generateUniqueCode();
      const { fileName, path } = req.body;
      const doc = new InventoryModel({
        fileName,
        path,
        code,
        uploadedBy: req.userId,
      });
      const document = await doc.save();
      return document;
    } catch (error) {
      throw error;
    }
  },
  async generateUniqueCode() {
    try {
      const uniqueId = await uuidv4();
      const id = uniqueId.replace(/[-a-z]/g, "").substring(0, 6);
      const isExists = await this.findOne({ code: id });
      if (isExists) {
        return this.generateUniqueCode();
      }
      return id;
    } catch (error) {
      throw error;
    }
  },
  async findOne(query) {
    try {
      const document = await InventoryModel.findOne(query);
      return document;
    } catch (error) {
      throw error;
    }
  },
  async delete(req, res) {
    try {
      const { id } = req.params;
      if (id && !mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error();
        error.status = 400;
        error.message = "Invalid id provided";
        throw error;
      }
      const document = await InventoryModel.findByIdAndDelete(id);
      if (!document) {
        const error = new Error();
        error.status = 404;
        error.message = "Document does not exist!";
        throw error;
      }
      if (document.path) {
        fs.unlink(document.path.substring(1,), (err) => {
          if (err) {
            console.log(err);
          }
        });
      }
      return {data: null, message: 'File deleted successfully!'};
    } catch (error) {
      throw error;
    }
  },
  async checkCode(req, res) {
    try {
      const { code, id } = req.body;
      const isCodeValid = await this.findOne({ code: code, _id: id });
      if (!isCodeValid) {
        return false;
      }
      return true;
    } catch (error) {
      throw error;
    }
  },
};
