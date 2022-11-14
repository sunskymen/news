import React from 'react'
import { Layout, Dropdown, Avatar  } from 'antd'
import { UserOutlined, MenuFoldOutlined, MenuUnfoldOutlined, } from '@ant-design/icons';
import { withRouter } from 'react-router-dom'
// 包裹组件 connect()(子组件)
import { connect } from 'react-redux'
const { Header } = Layout



function TopHeader(props) {

  // 切换左右图标
  const changeCollapsed = () => {
    // 通知父组件帮忙dispatch , redux改变状态
    props.changeCollapsed()
  }

  // 登录成功后获取用户信息
  const { username, role: { roleName } } = JSON.parse(localStorage.getItem('token'))
  const items = [
    {
      key: '1',
      label: <div>{ roleName }</div>,
    },
    {
      key: '2',
      danger: true,
      label: '退出',
    },
  ]

  // 下拉菜单处理
  const onClick = ({key}) => {
    if (key === '2') {
      // 清空token, 跳转登录
      localStorage.removeItem('token')
      props.history.push('/login')
    }
  };
  return (
    <Header className="site-layout-background" style={{ padding: '0 16px',}} >
      {
        props.isCollapsed ? <MenuUnfoldOutlined onClick={changeCollapsed}/> : <MenuFoldOutlined onClick={changeCollapsed}/>
      }
      <div style={{float:"right"}}>
        <span>欢迎<span style={{ color: "#1890ff", margin: "0 5px" }}>{ roleName }-{ username }</span>回来</span>
        <Dropdown menu={{ items,onClick }} >
          <Avatar size={64} icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header>
  )
}
/* 
  connect(
    mapStateToProps
    mapDispatchToProps
  )(被包装组件)
*/
// 通过props传递数据给子组件
const mapStateToProps = (state) => {
  // state包含多层(reducer合并时)
  return {
    isCollapsed: state.CollapsedReducer.isCollapsed
  }
}
// 通过props传递 action 即 方法
const mapDispatchToProps = {
  changeCollapsed() {
    // return 用来通知redux
    return {
      type: 'change_collapsed'
      // payload
    }
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(withRouter(TopHeader))