const UserModel = require("../models/user.model")

module.exports = {
    getAllUsers: async(req)=>{
       return await UserModel.find({})
    },
    getUser: async(id)=>{
        const user = await UserModel.findById(id);
        return user;
    },
    findUser: async(query)=>{
        const user = await UserModel.findOne(query);
        return user;
    },
    createUser: async (user)=>{
        const newUser = new UserModel(user)
        return await newUser.save();
    }
}