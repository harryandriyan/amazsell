const Review = require('../models/review-model')
const ReviewScrapper = require('../scrapper/review')

createReview = (req, res) => {
  const { asin } = req.params

  const reviewData = new Promise((resolve, reject) => {
    ReviewScrapper
      .scrapeReview(asin)
      .then(data => {
        resolve(data)
      })
      .catch(err => reject(err))
  })

  Promise.all([reviewData])
    .then(data => {
      const reviewData = data[0];

      reviewData.map(data => {
        const review = new Review(data)

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
      })
      
    })
    .catch(err => res.status(500).send(err))
}

updateReview = async(req, res) => {
  await Review.findOneAndUpdate({ _id: req.body.id }, {$set: {tags: req.body.tags}}, (err, review) => {
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

getReviewByASIN = async (req, res) => {
  const page  = parseInt(req.query.page)
  const limit = parseInt(req.query.limit)
  const asin  = req.query.asin

  try {

    const data = await Review.find({ asin })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

      // get total documents in the Posts collection 
      const count = await Review.countDocuments()

      // return response with posts, total pages, and current page
      res.status(200).json({
        data,
        totalPages: Math.ceil(count / limit),
        page
      })
    } catch (err) {
      console.error(err.message)
    }
}

getReviewCountByASIN = async (req, res) => {
  await Review.countDocuments({ asin: req.params.asin }, (err, review) => {
    if (err) {
      return res.status(400).json({ success: false, error: err })
    }

    return res.status(200).json({ success: true, count: review })
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
  getReviewByASIN,
  getReviewCountByASIN,
  getReviews,
}
