import axios, { AxiosInstance, AxiosResponse } from 'axios'

// API响应基础类型
export interface ApiResponse<T = any> {
  status?: string
  message?: string
  data?: T
  [key: string]: any
}

// 创建axios实例
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  timeout: 30000, // 30秒超时
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 可以在这里添加认证token等
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`API Response: ${response.status} ${response.config.url}`)
    return response
  },
  (error) => {
    console.error('API Error:', error)
    if (error.response) {
      // 服务器返回了错误状态码
      const message = error.response.data?.detail || error.response.data?.message || error.message
      throw new Error(`API请求失败 (${error.response.status}): ${message}`)
    } else if (error.request) {
      // 请求发送了但没有收到响应
      throw new Error('网络连接失败，请检查后端服务是否运行')
    } else {
      // 其他错误
      throw new Error(error.message || '未知错误')
    }
  }
)

export default api
