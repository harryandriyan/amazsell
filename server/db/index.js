const mongoose = require('mongoose')
const dotenv = require('dotenv');
dotenv.config();

const hostDb = process.env.MONGO_DATABASE_HOST
const database = process.env.MONGO_DATABASE_DB
const userDb = process.env.MONGO_DATABASE_USER
const passDb = process.env.MONGO_DATABASE_PASS

const mongoUri = `mongodb+srv://${userDb}:${passDb}@${hostDb}/${database}?retryWrites=true&w=majority`
mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .catch(e => {
    console.error('Connection error', e.message)
  })

const db = mongoose.connection

module.exports = db
