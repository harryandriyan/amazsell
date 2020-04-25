const Review = require('../models/review-model')

createReview = (req, res) => {
  const body = req.body

  if (!body) {
    return res.status(400).json({
      success: false,
      error: 'You must provide a review',
    })
  }

  const review = new Review(body)

  if (!review) {
    return res.status(400).json({ success: false, error: err })
  }

  review
    .save()
    .then(() => {
      return res.status(201).json({
        success: true,
        id: review._id,
        message: 'Review created!',
      })
    })
    .catch(error => {
      return res.status(400).json({
        error,
        message: 'Review not created!',
      })
    })
}

updateReview = async (req, res) => {
  const body = req.body

  if (!body) {
    return res.status(400).json({
      success: false,
      error: 'You must provide a body to update',
    })
  }

  Review.findOne({ _id: req.params.id }, (err, review) => {
    if (err) {
      return res.status(404).json({
        err,
        message: 'Review not found!',
      })
    }
    review.name = body.name
    review.time = body.time
    review.rating = body.rating
    review
      .save()
      .then(() => {
        return res.status(200).json({
          success: true,
          id: review._id,
          message: 'Review updated!',
        })
      })
      .catch(error => {
        return res.status(404).json({
          error,
          message: 'Review not updated!',
        })
      })
  })
}

deleteReview = async (req, res) => {
  await Review.findOneAndDelete({ _id: req.params.id }, (err, review) => {
    if (err) {
      return res.status(400).json({ success: false, error: err })
    }

    if (!review) {
      return res
        .status(404)
        .json({ success: false, error: `Review not found` })
    }

    return res.status(200).json({ success: true, data: review })
  }).catch(err => console.log(err))
}

getReviewById = async (req, res) => {
  await Review.findOne({ _id: req.params.id }, (err, review) => {
    if (err) {
      return res.status(400).json({ success: false, error: err })
    }

    return res.status(200).json({ success: true, data: review })
  }).catch(err => console.log(err))
}

getReviews = async (req, res) => {
  await Review.find({}, (err, reviews) => {
    if (err) {
      return res.status(400).json({ success: false, error: err })
    }
    if (!reviews.length) {
      return res
        .status(404)
        .json({ success: false, error: `Review not found` })
    }
    return res.status(200).json({ success: true, data: reviews })
  }).catch(err => console.log(err))
}

module.exports = {
  createReview,
  updateReview,
  deleteReview,
  getReviews,
  getReviewById,
}
