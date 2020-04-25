const mongoose = require('mongoose')

const mongoUri = 'mongodb+srv://root:123qwepoi@amazselldata-bbyi2.mongodb.net/amazsell_db?retryWrites=true&w=majority'
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
