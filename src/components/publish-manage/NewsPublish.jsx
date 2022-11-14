import React,{useEffect, useState} from 'react'
import { Table,Button, notification } from 'antd'
import axios from 'axios'

export default function NewsPublish(props) {
  const [list, setList] = useState([])
  useEffect(() => {
    setList(props.dataSource)
  },[props.dataSource])
  // 表格展示字段
  const columns = [
    {
      title: '新闻标题',
    dataIndex: 'title',
    render: (title,item) => {
      return <a href={`#/news-manage/preview/${item.id}`}>{ title }</a>
      }
    },
    {
      title: '作者',
      dataIndex: 'author',
    },
    {
      title: '新闻分类',
      dataIndex: 'category',
      render: (category) => {
        return <div>{ category.title }</div>
      }
  },
    {
      title: '操作',
      render: (item) => {
        if (props.PublishType === 1) {
          return <Button type='primary' onClick={() => { handlePublish(item) }}>发布</Button>
        }
        if (props.PublishType === 2) {
          return <Button type='danger' onClick={() => { handleSunset(item) }}>下线</Button>
        }
        if (props.PublishType === 3) {
          return <Button type='danger' onClick={() => { handleDelete(item) }}>删除</Button>
        }
      }
    }
  ]
    // 点击发布
  const handlePublish = (item) => {
    setList(list.filter(data => data.id !== item.id))
    // 更新后端数据
    axios.patch(`/news/${item.id}`, {
      publishState: 2,
      publishTime: Date.now()
    }).then((res) => {
      // 跳转页面
      props.history.push(`/publish-manage/published`)
      notification.info({
        message: '通知',
        description: '您可以到已发布中查看',
        placement:'buttomRight'
      })
    })
  }
    // 点击下线
  const handleSunset = (item) => {
    setList(list.filter(data => data.id !== item.id))
    // 更新后端数据
    axios.patch(`/news/${item.id}`, {
      publishState: 3,
    }).then((res) => {
      // 跳转页面
      props.history.push(`/publish-manage/published`)
      notification.info({
        message: '通知',
        description: '您可以到已下线中查看',
        placement:'buttomRight'
      })
    })
    }
    // 点击删除
  const handleDelete = (item) => {
    setList(list.filter(data => data.id !== item.id))
    // 删除后端数据
    axios.delete(`/news/${item.id}`).then((res) => {
      // 跳转页面
      props.history.push(`/publish-manage/published`)
      notification.info({
        message: '通知',
        description: '删除成功',
        placement:'buttomRight'
      })
    })
    }
  return (
    <div>
      <Table dataSource={list} columns={columns} pagination={{
        pageSize: 5
      }} rowKey={(item)=>item.id } />
    </div>
  )
}
