import React, { lazy, Suspense } from "react"

// 路由懒加载函数封装
function lazyLoad(path) {
  const Com = lazy(() => { import(path) })
  return (
    <Suspense fallback={<h1>正在加载中</h1>}>
      <Com />
    </Suspense>
  )
}
const element = [
  {
    path: '/', element: lazyLoad('../components/')
  }
]
export default element