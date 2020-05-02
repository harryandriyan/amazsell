const Review = require('../models/review-model')
const ReviewScrapper = require('../scrapper/review')

createReview = async (req, res) => {
  const { asin } = req.params

  ReviewScrapper.scrapeTotalPage(asin).then(totalPage => {

    for (let index = 1; index <= totalPage; index++) {

      new Promise((resolve, reject) => {
        ReviewScrapper
          .scrapeReview(asin, index)
          .then(reviewData => {

            reviewData.map(data => {
              const review = new Review(data)

              if (review) {
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

            })
          })
          .catch(err => reject(err))
      })
      
    }
  });

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
  const score = parseInt(req.query.score)
  const is_verified = req.query.is_verified
  const asin  = req.query.asin
  
  let params = { asin }
  if (score > 0) {
    params.score = score
  }
  if (is_verified === 'true') {
    params.is_verified = true
  }

  try {

    const data = await Review.find(params)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

      // get total documents in the Posts collection 
      const count = await Review.countDocuments(params)

      // return response with posts, total pages, and current page
      res.status(200).json({
        data,
        totalPages: Math.ceil(count / limit),
        totalData: count,
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

getInsight = async (req, res) => {
  await Review.find({}, (err, reviews) => {
    if (err) {
      return res.status(400).json({ success: false, error: err })
    }

    const one = reviews.filter(review => review.score === 1).length
    const two = reviews.filter(review => review.score === 2).length
    const three = reviews.filter(review => review.score === 3).length
    const four = reviews.filter(review => review.score === 4).length
    const five = reviews.filter(review => review.score === 5).length
    const insight = [
      { name: '🌟', total: one },
      { name: '🌟🌟', total: two },
      { name: '🌟🌟🌟', total: three },
      { name: '🌟🌟🌟🌟', total: four },
      { name: '🌟🌟🌟🌟🌟', total: five }
    ]
    
    return res.status(200).json({ success: true, data: insight })
  }).catch(err => console.log(err))
}

module.exports = {
  createReview,
  updateReview,
  deleteReview,
  getReviewByASIN,
  getReviewCountByASIN,
  getReviews,
  getInsight
}
