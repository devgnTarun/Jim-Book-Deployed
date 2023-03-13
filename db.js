const mongoose = require("mongoose");



const conectToMongo = () => {
  mongoose.connect(process.env.DB_URI ).then((data) => {
    console.log(`MongoDb connected to server ${data.connection.host}`);
  });
};

module.exports = conectToMongo;
