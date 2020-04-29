const express = require('express')

const ReviewCtrl = require('../controllers/review-ctrl')

const router = express.Router()

router.post('/review', ReviewCtrl.createReview)
router.delete('/review/:id', ReviewCtrl.deleteReview)
router.get('/review', ReviewCtrl.getReviews)
router.get('/review-by-asin', ReviewCtrl.getReviewByASIN)

module.exports = router
