import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Table, Tag ,Button,notification } from 'antd'
export default function AuditList(props) {
  // 获取当前用户的信息
  const {username} = JSON.parse(localStorage.getItem('token'))
  useEffect(() => {
    axios.get(`/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`).then((res) => {
      setData(res.data)
    })
  }, [username])
  // 保存请求到的新闻
  const [data, setData] = useState([])
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
      title: '审核状态',
      dataIndex: 'auditState',
      render: (auditState) => {
        const colorList = ['', 'orange', 'green', 'red']
        const auditList = ['草稿箱','审核中','已通过','未通过']
        return <Tag color={colorList[auditState]}>{ auditList[auditState] }</Tag>
      }
    },
      {
        title: '操作',
        render: (item) => {
          return <div>
            {
              item.auditState === 1 && <Button type='danger' onClick={()=>{handleRervert(item)}}>撤销</Button>
            }
            {
              item.auditState === 2 && <Button onClick={()=>{handlePublish(item)}}>发布</Button>
            }
            {
              item.auditState === 3 && <Button type="primary" onClick={()=>{handleUpdate(item)}}>更新</Button>
            }
          </div>
        }
      }
  ]
  // 点击发布
  const handlePublish = (item) => {
    setData(data.filter((data) => item.id !== data.id))
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
  // 点击更新
  const handleUpdate = (item) => {
    props.history.push(`/news-manage/update/${item.id}`)
  }
  // 点击撤销
  const handleRervert = (item) => {
    setData(data.filter((data) => item.id !== data.id))
    axios.patch(`/news/${item.id}`, {
      auditState: 0
    }).then((res) => {
      notification.info({
        message: '通知',
        description: '您可以到草稿箱中查看',
        placement:'buttomRight'
      })
    })
  }
  return (
    <div>
      <Table dataSource={data} columns={columns} pagination={{
        pageSize: 5
      }} rowKey={(item)=>item.id } />
    </div>
  )
}
