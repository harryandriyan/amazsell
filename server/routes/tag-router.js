const express = require('express')

const TagCtrl = require('../controllers/tag-ctrl')

const router = express.Router()

router.post('/tag', TagCtrl.createTag)
router.delete('/tag/:id', TagCtrl.deleteTag)
router.get('/tags', TagCtrl.getTags)
router.get('/tags-by-asin', TagCtrl.getTagsByASIN)

module.exports = router
