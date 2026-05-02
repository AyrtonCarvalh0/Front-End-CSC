import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('csc_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 403 || err.response?.status === 401) {
      localStorage.removeItem('csc_token')
      localStorage.removeItem('csc_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
