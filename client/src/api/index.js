import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
})

export const insertProduct = payload => api.post(`/product`, payload)
export const getAllProduct = () => api.get(`/product`)
export const deleteProductById = id => api.delete(`/product/${id}`)
export const getProductById = id => api.get(`/product/${id}`)

export const generateReview = asin => api.post(`/review/${asin}`)
export const updateReview = payload => api.put(`/review`, payload)
export const deleteReviewById = id => api.delete(`/review/${id}`)
export const getAllReview = () => api.get(`/review`)
export const getReviewByASIN = (payload) => {
  const uri = `/review-by-asin?asin=${payload.asin}&page=${payload.page}&limit=${payload.limit}`
  return api.get(uri)
}
export const getReviewCountByASIN = asin => api.get(`/review-count-by-asin/${asin}`)

export const insertTag = payload => api.post(`/tag`, payload)
export const deleteTagsById = id => api.delete(`/tag/${id}`)
export const getAllTags = () => api.get(`/tags`)
export const getTagsByASIN = asin => api.get(`/tags-by-asin/${asin}`)

const apis = {
  insertProduct,
  getAllProduct,
  deleteProductById,
  getProductById,

  generateReview,
  updateReview,
  deleteReviewById,
  getAllReview,
  getReviewByASIN,
  getReviewCountByASIN,
  
  insertTag,
  deleteTagsById,
  getAllTags,
  getTagsByASIN,
}

export default apis
