const Product = require('../models/product-model')
const ProductScrapper = require('../scrapper/product')

createProduct = (req, res) => {
  const body = req.body

  if (!body) {
    return res.status(400).json({
      success: false,
      error: 'You must provide a product',
    })
  }

  const productInfo = new Promise((resolve, reject) => {
    ProductScrapper
      .scrapeProduct(body.productLink)
      .then(data => {
        resolve(data)
      })
      .catch(err => reject('Product scrape failed'))
  })

  Promise.all([productInfo])
    .then(data => {
      const productData = data[0];

      const product = new Product(productData)

      if (!product) {
        return res.status(400).json({ success: false, error: err })
      }

      product
        .save()
        .then(() => {
          return res.status(201).json({
          success: true,
          id: product._id,
          message: 'Product created!',
        })
      })
      .catch(error => {
        return res.status(400).json({
          error,
          message: 'Product not created!',
        })
      })
    })
    .catch(err => res.status(500).send(err))

}

deleteProduct = async (req, res) => {
  await Product.findOneAndDelete({ _id: req.params.id }, (err, product) => {
  if (err) {
    return res.status(400).json({ success: false, error: err })
  }

  if (!product) {
    return res
    .status(404)
    .json({ success: false, error: `Product not found` })
  }

  return res.status(200).json({ success: true, data: product })
  }).catch(err => console.log(err))
}

getProductById = async (req, res) => {
  await Product.findOne({ _id: req.params.id }, (err, product) => {
  if (err) {
    return res.status(400).json({ success: false, error: err })
  }

  return res.status(200).json({ success: true, data: product })
  }).catch(err => console.log(err))
}

getProducts = async (req, res) => {
  await Product.find({}, (err, products) => {
  if (err) {
    return res.status(400).json({ success: false, error: err })
  }
  if (!products.length) {
    return res
    .status(404)
    .json({ success: false, error: `Product not found`, data: [] })
  }
  return res.status(200).json({ success: true, data: products })
  }).catch(err => console.log(err))
}

module.exports = {
  createProduct,
  deleteProduct,
  getProducts,
  getProductById,
}
