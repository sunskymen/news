import axios from 'axios'
import { store } from '../redux/store'
axios.defaults.baseURL = 'http://localhost:5000'

// axios.defaults.headers

axios.interceptors.request.use(function (config) {
  // 请求前的配置
  // 显示loading
  store.dispatch({type:'change_loading', payload: true})
  // 需要返回配置项
  return config
}, function (error) {
  // 请求失败
  return Promise.reject(error)
})

axios.interceptors.response.use(function (response) {
  store.dispatch({type:'change_loading', payload: false})

  // 需要返回响应回来的数据 一般return response.data
  return response
}, function (error) {
  // 响应失败
  store.dispatch({ type: 'change_loading', payload: false })
  return Promise.reject(error)
})