import React,{useState, useEffect} from 'react'
import { Table, Button,Modal,notification } from 'antd'
import {DeleteOutlined,EditOutlined,ExclamationCircleOutlined,VerticalAlignTopOutlined } from '@ant-design/icons'
import axios from 'axios'
const {confirm} = Modal

export default function NewsDraft(props) {
  // 读取本地用户信息
  const User = JSON.parse(localStorage.getItem('token'))
  const [data, setData] = useState([])

  

  // 表格字段
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id'
    },
    {
      title: '新闻标题',
      dataIndex: 'title',
      render: (title,item) => {
        return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
      }
    },
    {
      title: '作者',
      dataIndex: 'author'
    },
    {
      title: '新闻分类',
      dataIndex: 'category',
      render: (category) => {
        return category.title
      }
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button type="danger" shape="circle" icon={<DeleteOutlined />} onClick={()=>delConfirm(item)}></Button>
          <Button style={{margin:"0 10px"}} type="primary" shape="circle" icon={<EditOutlined />} onClick={()=>{props.history.push(`/news-manage/update/${item.id}`)}}></Button>
          <Button type="primary" shape="circle" icon={<VerticalAlignTopOutlined />} onClick={()=>hanleCheck(item.id)}></Button>
        </div>
      }
    }
  ]
  useEffect(() => {
    // 请求新闻为草稿箱数据
    axios.get(`/news?author=${User.username}&auditState=0&_expand=category`).then((res) => {
      setData(res.data)
    })
  }, [User.username])

  // 点击提交审核
  const hanleCheck = (id) => {
    axios.patch(`/news/${id}`, {
      auditState: 1
    }).then(() => {
      props.history.push('/audit-manage/list')
      notification.info({
        message: '提示',
        description: '您可以到审核列表中查看',
        placement:'bottomRight'
      })
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
    axios.delete(`/news/${item.id}`)
  }


  return (
    <div>
      <Table dataSource={data} columns={columns} rowKey={(item) => item.id}
      pagination={{pageSize:5}}></Table>
    </div>
  )
}

