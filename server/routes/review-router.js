const express = require('express')

const ReviewCtrl = require('../controllers/review-ctrl')

const router = express.Router()

router.post('/review', ReviewCtrl.createReview)
router.put('/review/:id', ReviewCtrl.updateReview)
router.delete('/review/:id', ReviewCtrl.deleteReview)
router.get('/review/:id', ReviewCtrl.getReviewById)
router.get('/review', ReviewCtrl.getReviews)

module.exports = router
