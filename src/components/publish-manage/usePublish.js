// 自定义hooks
import { useEffect, useState } from 'react'
import axios from 'axios'

function usePublish(arg) {
  // 获取当前用户的信息
  const {username} = JSON.parse(localStorage.getItem('token'))
  useEffect(() => {
    axios.get(`/news?author=${username}&publishState=${arg}&_expand=category`).then((res) => {
      setData(res.data)
    })
  }, [username,arg])
  // 保存请求到的新闻
  const [data, setData] = useState([])

  return {data}
}
export default usePublish