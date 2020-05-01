const Product = require('../models/product-model')
const Review = require('../models/review-model')
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
      .catch(err => reject(err))
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
  await Product.findOneAndDelete({ asin: req.params.asin }, (err, product) => {
    return product
  }).catch(err => console.log(err))

  await Review.deleteMany({ asin: req.params.asin }, (err, review) => {
    return review
  }).catch(err => console.log(err))

  return res
    .status(200)
    .json({ success: false, error: `Product deleted` })
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

  const page  = parseInt(req.query.page)
  const limit = parseInt(req.query.limit)

  try {

    const data = await Product.find({ })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

      // get total documents in the Posts collection 
      const count = await Product.countDocuments()

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

module.exports = {
  createProduct,
  deleteProduct,
  getProducts,
  getProductById,
}
