const express = require("express");
const mongoose = require("mongoose");
const dotenv = require('dotenv')

dotenv.config()

const mongoDB = ()=> {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("Connect to mongoose"))
    .catch((err) => console.log(err));
}

module.exports = mongoDB