import React, {useEffect, useState} from 'react'
import { Table, Tag ,Button, Modal,Popover,Switch } from 'antd'
import {DeleteOutlined,EditOutlined,ExclamationCircleOutlined } from '@ant-design/icons'
import axios from 'axios'
const { confirm } = Modal



export default function RightList() {
  const [data, setData] = useState([])

  // 表格展示字段
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '权限名称',
      dataIndex: 'title',
    },
    {
      title: '权限路径',
      dataIndex: 'key',
      render: (key) => {
        return <Tag color="blue">{ key }</Tag>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button style={{margin:"0 10px"}} type="danger" shape="circle" icon={<DeleteOutlined />} onClick={()=>{delConfirm(item)}}></Button>
          <Popover placement="rightBottom" content={<div>
            <Switch checked={item.pagepermisson}  onChange={()=>editSwitch(item)}></Switch>
          </div>} title="页面配置项" trigger={item.pagepermisson===undefined?'':'click'}>
            <Button type="primary" shape="circle" icon={<EditOutlined />} disabled={item.pagepermisson===undefined}></Button>
          </Popover>
        </div>
      }
    }
  ]
  useEffect(() => {
    axios.get('/rights?_embed=children').then((res) => {
      const list = res.data
      list.forEach((item) => {
        item.children = item.children.length === 0 ? item.children='' : item.children
      })
      setData(res.data)
    })
  },[])
  // 编辑开关事件
  const editSwitch = (item) => {
    item.pagepermisson = item.pagepermisson === 1 ? 0 : 1
    setData([...data])
        // 判断层级
    if (item.grade === 1) {
      // 更新数据库
      axios.patch(`/rights/${item.id}`, {
        pagepermisson : item.pagepermisson
      })
    } else {
      axios.patch(`/children/${item.id}`, {
        pagepermisson : item.pagepermisson
      })
    }
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
    // 判断层级
    if (item.grade === 1) {
      // 对列表进行过滤后渲染即可
      setData(data.filter((data) => data.id !== item.id))
      // 发请求删除数据库中
      // axios.delete(`/rights/${item.id}`)
    } else {
      let newData = data.filter((data) => data.id === item.rightId)
      newData[0].children = newData[0].children.filter((data)=>data.id !== item.id)
      setData([...data])
      // 发请求删除数据库中
      // axios.delete(`/children/${item.id}`)
    }

  }
  return (
    <div>
      <Table dataSource={data} columns={columns} pagination={{
        pageSize:5
      }} />
    </div>
  )
}
