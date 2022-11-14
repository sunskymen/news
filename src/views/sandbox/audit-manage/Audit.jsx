import React, {useState, useEffect} from 'react'
import axios from 'axios'
import {Button, notification, Table} from 'antd'


export default function Audit() {
  // 获取用户信息
  const {roleId,region,username} = JSON.parse(localStorage.getItem('token'))
  // 请求并存储需要审核的新闻
  const [data,setData] = useState([])
  useEffect(() => {
    // 角色映射
    const roleObj = {
      '1': 'superadmin',
      '2': 'admin',
      '3': 'editor'
    }
    axios.get(`/news?auditState=1&_expand=category`).then((res) => {
      const list = res.data
      // 超级管理员可以审核全部 , 区域管理员 审核自己 和 同区域下的编辑
      setData(roleObj[roleId] === 'superadmin'? list : [...list.filter(item=>item.author === username), ...list.filter(item=>item.region === region && roleObj[item.roleId]==='editor')])
    })
  }, [roleId, region, username])
  
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
        return <div>
          <Button type='primary' onClick={()=>handleAudit(item,2,1)}>通过</Button>
          <Button type='danger' onClick={()=>handleAudit(item,3,0)}>驳回</Button>
        </div>
      }
    }
  ]
  // 处理通过 \ 驳回事件
  const handleAudit = (item,auditState,publishState) => {
    setData(data.filter(data => data.id !== item.id))
    
    // 更新后端
    axios.patch(`/news/${item.id}`, {
      auditState,
      publishState
    }).then((res) => {
      notification.info({
        message: '通知',
        description: '操作成功',
        placement:'bottomRight'
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
