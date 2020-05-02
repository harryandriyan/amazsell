const express = require('express')

const ReviewCtrl = require('../controllers/review-ctrl')

const router = express.Router()

router.post('/review/:asin', ReviewCtrl.createReview)
router.put('/review', ReviewCtrl.updateReview)
router.delete('/review/:id', ReviewCtrl.deleteReview)
router.get('/review', ReviewCtrl.getReviews)
router.get('/review-by-asin', ReviewCtrl.getReviewByASIN)
router.get('/review-count-by-asin/:asin', ReviewCtrl.getReviewCountByASIN)
router.get('/review-insight', ReviewCtrl.getInsight)

module.exports = router
