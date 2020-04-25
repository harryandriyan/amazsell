const express = require('express')

const ProductCtrl = require('../controllers/product-ctrl')

const router = express.Router()

router.post('/product', ProductCtrl.createProduct)
router.delete('/product/:id', ProductCtrl.deleteProduct)
router.get('/product/:id', ProductCtrl.getProductById)
router.get('/product', ProductCtrl.getProducts)

module.exports = router
