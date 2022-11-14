import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'
import './index.css'
import { HomeFilled,FunnelPlotFilled,EditFilled,GoldFilled,CrownFilled,ContainerFilled  } from '@ant-design/icons'
import { Layout, Menu } from 'antd'
import axios from 'axios'
// 包裹组件 connect()(子组件)
import { connect } from 'react-redux'
const { Sider } = Layout

/* const items = [
  {
    key: '/home',
    icon: <UserOutlined />,
    label: '首页'
  },
  {
    key: '/user-manage',
    icon: <VideoCameraOutlined />,
    label: '用户管理',
    children: [
      {
        key: '/user-manage/list',
        icon: <VideoCameraOutlined />,
        label: '用户列表'
      }
    ]
  },
  {
    key: '/right-manage',
    icon: <UploadOutlined />,
    label: '权限管理',
    children: [
      {
        key: '/right-manage/right/list',
        icon: <UploadOutlined />,
        label: '权限列表',
      },
      {
        key: '/right-manage/role/list',
        icon: <UploadOutlined />,
        label: '角色列表',
      }
    ]
  },
] */

// 图标映射表
const iconList = {
  "/home": <HomeFilled />,
  "/user-manage": <CrownFilled />,
  "/user-manage/list": <CrownFilled />,
  "/right-manage": <GoldFilled />,
  "/right-manage/role/list": <GoldFilled />,
  "/right-manage/right/list": <GoldFilled />,
  "/news-manage":<ContainerFilled />,
  "/news-manage/add":<ContainerFilled />,
  "/news-manage/draft":<ContainerFilled />,
  "/news-manage/category":<ContainerFilled />,
  "/audit-manage":<FunnelPlotFilled />,
  "/audit-manage/audit":<FunnelPlotFilled />,
  "/audit-manage/list":<FunnelPlotFilled />,
  "/publish-manage":<EditFilled />,
  "/publish-manage/unpublished":<EditFilled />,
  "/publish-manage/published":<EditFilled />,
  "/publish-manage/sunset":<EditFilled />
}


function SideMenu(props) {
  // 所有权限列表
  const [list, setList] = useState([])
  // localstorage取出用户的权限列表
  const { role: { rights } } = JSON.parse(localStorage.getItem('token'))
  
  // 根据url, 默认展开项
  const selectedKeys = [props.location.pathname]
  const openKeys = ['/' + props.location.pathname.split('/')[1]]

  // 请求权限列表数据
  useEffect( () => {
    axios.get('/rights?_embed=children').then((res) => {
      const arr = handleChildren(res.data)
      setList(arr)
    })
    // eslint-disable-next-line
  }, [])


  // 过滤请求数据用于权限渲染
  function handleChildren(list) {
    const arr = []
    list.forEach((item) => {
      if (item.pagepermisson && rights.includes(item.key)) {
        if (item.children && item.children.length !== 0) {
          const childrenArr = handleChildren(item.children)
          let obj = {
            id: item.id,
            title: item.title,
            key: item.key,
            label: item.title,
            icon: iconList[item.key],
            children: childrenArr
          }
          arr.push(obj)
        } else {
          let obj = {
            id: item.id,
            title: item.title,
            key: item.key,
            label: item.title,
            icon: iconList[item.key]
          }
          arr.push(obj)
        }
      }
    })
    return arr
  }

  return (
      <Sider trigger={null} collapsible collapsed={props.isCollapsed}>
      <div style={{display:"flex", height:"100%", flexDirection:"column"}}>
        <div className="logo">新闻发布管理系统</div>
        <Menu
          style={{flex:"1", "overflow":"auto"}}
          theme="dark"
          mode="inline"
          selectedKeys={selectedKeys}
          defaultOpenKeys={openKeys}
          items={list}
          onClick={ (e)=>{props.history.push(e.key)}}
          />
      </div>
      </Sider>
  )
}
// 通过props传递数据给子组件
const mapStateToProps = (state) => {
  // state包含多层(reducer合并时)
  return {
    isCollapsed: state.CollapsedReducer.isCollapsed
  }
}
export default connect(mapStateToProps)(withRouter(SideMenu))
