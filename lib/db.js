const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const {
  MONGO_HOST,
  MONGO_PORT,
  MONGO_DB,
  MONGO_USER,
  MONGO_PASS,
} = process.env;

const url = `mongodb://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}`;

const connectDB = () => mongoose.connect(url, { useNewUrlParser: true });

module.exports = { connectDB };
