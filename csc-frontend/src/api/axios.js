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
    const status = err.response?.status
    const isAuthEndpoint = err.config?.url?.includes('/auth/')

    if ((status === 401 || status === 403) && !isAuthEndpoint) {
      const token = localStorage.getItem('csc_token')
      if (!token) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(err)
  }
)

export default api
