import React, { useEffect, useState } from 'react'
import Home from '../../views/sandbox/home/Home'
import UserList from '../../views/sandbox/user-manage/UserList'
import RoleList from '../../views/sandbox/right-manage/RoleList'
import RightList from '../../views/sandbox/right-manage/RightList'
import NoPermission from '../../views/sandbox/nopermission/NoPermission'
import { Switch, Route, Redirect } from 'react-router-dom'
import NewsAdd from '../../views/sandbox/news-manage/NewsAdd'
import NewsDraft from '../../views/sandbox/news-manage/NewsDraft'
import NewsCategory from '../../views/sandbox/news-manage/NewsCategory'
import NewsPreview from '../../views/sandbox/news-manage/NewsPreview'
import NewsUpdate from '../../views/sandbox/news-manage/NewsUpdate'
import Audit from '../../views/sandbox/audit-manage/Audit'
import AuditList from '../../views/sandbox/audit-manage/AuditList'
import Unpublished from '../../views/sandbox/publish-manage/Unpublished'
import Published from '../../views/sandbox/publish-manage/Published'
import Sunset from '../../views/sandbox/publish-manage/Sunset'
import axios from 'axios'
import { Spin } from 'antd'
import {connect} from 'react-redux'


// 路由映射表
const LocalRouterMap = {
  "/home": Home,
  "/user-manage/list": UserList,
  "/right-manage/role/list": RoleList,
  "/right-manage/right/list": RightList,
  "/news-manage/add": NewsAdd,
  "/news-manage/draft": NewsDraft,
  "/news-manage/category": NewsCategory,
  "/news-manage/preview/:id": NewsPreview,
  "/news-manage/update/:id": NewsUpdate,
  "/audit-manage/audit": Audit,
  "/audit-manage/list": AuditList,
  "/publish-manage/unpublished": Unpublished,
  "/publish-manage/published": Published,
  "/publish-manage/sunset": Sunset
}

function NewsRouter(props) {

  const [BackRouteList, setBackRouteList] = useState([])
  useEffect(() => {
    // 获取全部路由的数据,但需要扁平化
    Promise.all([
      axios.get('/rights'),
      axios.get('/children')
    ]).then((res) => {
      setBackRouteList([...res[0].data, ...res[1].data])
    })
  }, [])

  // 检查是否存在匹配的映射, 并且页面开关状态和一些路由的开关
  const checkRoute = (item) => {
    return LocalRouterMap[item.key] && (item.pagepermisson || item.routepermisson)
  }
  // 用户的权限列表有无
  const { role: { rights } } = JSON.parse(localStorage.getItem('token'))
  const checkUserPermission = (item) => {
    return rights.includes(item.key)
  }

  return (
      <Spin size="large" spinning={props.loading}>
      <Switch>
        {/* 渲染全部路由组件 */}
        {
          BackRouteList.map((item) => {
            if (checkRoute(item) && checkUserPermission(item)) {
              return <Route exact path={item.key} key={item.key} component={LocalRouterMap[item.key]}></Route>
            } else {
              return null
            }
          }
          )
        }
        <Redirect exact from='/' to='/home'></Redirect>
        {/* 顺序匹配之后 , 除此之外的路径, 报403 */}
        {
          BackRouteList.length > 0 && <Route path='*' component={NoPermission}></Route>
        }

      </Switch>
    </Spin>
  )
}
const mapStateToProps = (state) => {
  return {
    loading: state.LoadingReducer.loading
  }
}

export default connect(mapStateToProps)(NewsRouter)
