const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Review = new Schema(
  {
    title: { type: String, required: true },
    body_copy: { type: String, required: true },
    score: { type: Number, required: true },
    date: { type: String, required: true },
    author: { type: String, required: true },
    number_of_comment: { type: Number, required: true },
    is_has_media: { type: Boolean, required: true },
    is_verified: { type: Boolean, required: true },
    is_child: { type: Boolean, required: true },
  },
  { timestamps: true },
)

module.exports = mongoose.model('review', Review)
