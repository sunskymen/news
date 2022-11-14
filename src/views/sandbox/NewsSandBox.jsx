import React, { useEffect } from 'react'
import SideMenu from '../../components/sandbox/SideMenu'
import TopHeader from '../../components/sandbox/TopHeader'
import NewsRouter from '../../components/sandbox/NewsRouter'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import './NewsSandBox.css'
import {Layout} from 'antd'
const { Content } = Layout



export default function NewsSandBox() {
  NProgress.start()
  useEffect(() => {
    NProgress.done()
  })
  return (
    <Layout>
      {/* 侧边栏 */}
      <SideMenu></SideMenu>
      {/* 右边部分 */}
      <Layout className="site-layout">
        {/* 头部 */}
        <TopHeader></TopHeader>
        {/* 内容 */}
        <Content
          className="site-layout-background"
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            overflow: 'auto'
          }}
        >
          <NewsRouter></NewsRouter>
        </Content>
      </Layout>
    </Layout>
  )
}
