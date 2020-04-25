import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
})

export const insertProduct = payload => api.post(`/product`, payload)
export const getAllProduct = () => api.get(`/product`)
export const updateProductById = (id, payload) => api.put(`/product/${id}`, payload)
export const deleteProductById = id => api.delete(`/product/${id}`)
export const getProductById = id => api.get(`/product/${id}`)

export const insertReview = payload => api.post(`/review`, payload)
export const getAllReview = () => api.get(`/review`)
export const updateReviewById = (id, payload) => api.put(`/review/${id}`, payload)
export const deleteReviewById = id => api.delete(`/review/${id}`)
export const getReviewById = id => api.get(`/review/${id}`)

const apis = {
  insertProduct,
  getAllProduct,
  updateProductById,
  deleteProductById,
  getProductById,

  insertReview,
  getAllReview,
  updateReviewById,
  deleteReviewById,
  getReviewById,
}

export default apis
