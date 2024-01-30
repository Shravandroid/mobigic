const mongoose = require('mongoose')


async function dbConnection () {
    try {
    
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("mongodb connection successful");
    } catch (error) {
        console.log(error);
    }
}

module.exports = dbConnection