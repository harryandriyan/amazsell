import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
})

export const insertProduct = payload => api.post(`/product`, payload)
export const getAllProduct = (payload) => {
  const uri = `/product?page=${payload.page}&limit=${payload.limit}`
  return api.get(uri)
}
export const deleteProductById = id => api.delete(`/product/${id}`)
export const getProductByASIN = asin => api.get(`/product/${asin}`)

export const generateReview = asin => api.post(`/review/${asin}`)
export const updateReview = payload => api.put(`/review`, payload)
export const deleteReviewById = id => api.delete(`/review/${id}`)
export const getAllReview = () => api.get(`/review`)
export const getReviewByASIN = (payload) => {
  const uri = `/review-by-asin?asin=${payload.asin}&page=${payload.page}&limit=${payload.limit}&score=${payload.score}&is_verified=${payload.is_verified}`
  return api.get(uri)
}
export const getReviewCountByASIN = asin => api.get(`/review-count-by-asin/${asin}`)
export const getReviewInsight = () => api.get(`/review-insight`)

export const insertTags = payload => api.post(`/tag`, payload)
export const deleteTagsById = id => api.delete(`/tag/${id}`)
export const getTags = (payload) => {
  const uri = `/tags?page=${payload.page}&limit=${payload.limit}`
  return api.get(uri)
}
export const getAllTags = () => api.get(`/all-tags`)
export const getTagsByASIN = asin => api.get(`/tags-by-asin/${asin}`)

const apis = {
  insertProduct,
  getAllProduct,
  deleteProductById,
  getProductByASIN,

  generateReview,
  updateReview,
  deleteReviewById,
  getAllReview,
  getReviewByASIN,
  getReviewCountByASIN,
  getReviewInsight,
  
  insertTags,
  deleteTagsById,
  getTags,
  getAllTags,
  getTagsByASIN,
}

export default apis
