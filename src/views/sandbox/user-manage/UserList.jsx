import React, {useEffect, useState} from 'react'
import { Table,Button, Modal,Switch } from 'antd'
import {DeleteOutlined,EditOutlined,ExclamationCircleOutlined } from '@ant-design/icons'
import axios from 'axios'
// 导入组件
import CollectionCreateForm from '../../../components/user-manage/CollectionCreateForm'
const { confirm } = Modal


export default function UserList() {
  const [data, setData] = useState([])
  const [openForm, setOpenForm] = useState(false)
  const [openUpdateForm, setOpenUpdateForm] = useState(false)
  // 初始化数据
  const [roleList, setRoleList] = useState([])
  const [regionList, setRegionList] = useState([])
  // 保存需要更新的项
  const [currentUpdate, setCurrentUpdate] = useState({})
  // localstorage取出用户的数据
  const { roleId:CurrentRoleId } = JSON.parse(localStorage.getItem('token'))
  // 发请求获取数据
  useEffect(() => {
    axios.get('/regions').then((res) => {
      setRegionList(res.data)
    })
  }, [])
  useEffect(() => {
    axios.get('/roles').then((res) => {
      setRoleList(res.data)
    })
  }, [])

  // 表格展示字段
  const columns = [
    {
      title: '区域',
      dataIndex: 'region',
      filters: [...regionList.map((item) => {
        return {
          text: item.title,
          value: item.value,
        }
      }),{text: '全球',value: ''}],
      onFilter: (value, item) => item.region===value,
      render: (region) => {
        return region === '' ? '全球': region
      }
    },
    {
      title: '角色名称',
      dataIndex: 'role',
      render: (role) => {
        return role?.roleName
      }
    },
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '用户状态',
      dataIndex: 'roleState',
      render: (roleState, item) => {
        return <Switch checked={roleState} disabled={item.default} onChange={()=>{handleChange(item)}}></Switch>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button style={{margin:"0 10px"}} type="danger" shape="circle" icon={<DeleteOutlined />} onClick={()=>{delConfirm(item)}} disabled={item.default}></Button>
          <Button type="primary" shape="circle" icon={<EditOutlined />} disabled={item.default} onClick={()=>{handleUpdate(item)}}></Button>
        </div>
      }
    }
  ]

  useEffect(() => {
    axios.get('/users?_expand=role').then((res) => {
      // 需要对用户过滤, 区域管理仅看到自己区域(简单)
      const list = res.data.filter((item) => item.roleId >= CurrentRoleId)
      setData(list)
    })
  },[CurrentRoleId])

  // 编辑更新按钮事件
  const handleUpdate = (item) => {
    // 显示表单
    setOpenUpdateForm(true)
    // 保存需要更新的项
    setCurrentUpdate(item)
  }
  // 确认更新用户
  const onUpdate = (values) => {
    // 更新页面数据, 但是没有联表role字段
/*     setData(data.map((item) => {
      if (item.id === currentUpdate.id) {
        return {
          ...values,
          id: currentUpdate.id,
          roleState: true,
          default:false
        }
      }
      return item
    })) */
    // 更新后端数据
    axios.patch(`/users/${currentUpdate.id}`,values)
    setOpenUpdateForm(false)
    // 重新请求联表数据或者自己插入另外字段
    axios.get('/users?_expand=role').then((res) => {
      setData(res.data)
    })
  }

  // 改变用户状态按钮事件
  const handleChange = (item) => {
    // 更新页面
    item.roleState = !item.roleState
    setData([...data])
    // 更新后端数据
    axios.patch(`/users/${item.id}`, {
      ...item,
      roleState:item.roleState
    })
  }

  // 弹出删除对话框
  const delConfirm = (item) => {
    confirm({
      title: 'Do you Want to delete these items?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        deleteMethod(item)
      },
      onCancel() {
      },
    });
  }
  // 确认删除方法
  const deleteMethod = (item) => {
      // 对列表进行过滤后渲染即可
      setData(data.filter((data) => data.id !== item.id))
      // 发请求删除数据库中
      axios.delete(`/users/${item.id}`)
    }

  // 确认添加新用户处理
  const onCreate = (values) => {
    // post到后端生成id, 再更新data
    axios.post('/users', {
      ...values,
      roleState: true,
      default: false,
    }).then(() => {
      // 插入数据成功后
      // 重新请求联表数据或者自己插入另外字段
      axios.get('/users?_expand=role').then((res) => {
        setData(res.data)
      })
    })
    // 关闭对话框
    setOpenForm(false)
      }

  return (
    <div>
      <Button type='primary' onClick={() => { setOpenForm(true) }}>添加用户</Button>
      <Table dataSource={data} columns={columns} pagination={{
        pageSize:5
      }} rowKey={item => item.id} />
      
      {/* 添加新用户表单 */}
      <CollectionCreateForm open={openForm} title='添加新用户' onCreate={onCreate} onCancel={() => { setOpenForm(false) }} roleList={roleList} regionList={regionList}></CollectionCreateForm>
      
      {/* 更新用户表单 */}
      <CollectionCreateForm open={openUpdateForm} title='更新用户' onCreate={onUpdate} onCancel={() => {setOpenUpdateForm(false)}} roleList={roleList} regionList={regionList} ></CollectionCreateForm>
    </div>
  )
}

