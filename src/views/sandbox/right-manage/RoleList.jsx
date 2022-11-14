import React,{useState, useEffect} from 'react'
import { Table, Button,Modal,Tree } from 'antd'
import {DeleteOutlined,UnorderedListOutlined,ExclamationCircleOutlined } from '@ant-design/icons'
import axios from 'axios'
const {confirm} = Modal

export default function RoleList() {
  const [data, setData] = useState([])
  const [treeData, setTreeData] = useState([])
  const [CurrentTreeData, setCurrentTreeData] = useState([])
  const [CurrentId, setCurrentId] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)

  
  // 对话框事件
  // 点击显示
  const showModal = (item) => {
    setIsModalOpen(true)
    // 默认选中的树形
    setCurrentTreeData(item.rights)
    // 保存当前点击的id
    setCurrentId(item.id)
  }
  // 点击确认
  const handleOk = () => {
    setIsModalOpen(false)
    // 找到后替换最新数据,同步data
    setData(data.map(item => {
      if (item.id === CurrentId) {
        return {
          ...item,
          rights:CurrentTreeData
        }
      }
      return item
    }))
    // 同步后端数据
    axios.patch(`/roles/${CurrentId}`, {
      rights:CurrentTreeData
    })
  }
  // 点击取消
  const handleCancel = () => {
    setIsModalOpen(false);
  }
  // 树形事件
  const onCheck = (checkedKeys) => {
    // 当前需要重新展示的树形
    setCurrentTreeData(checkedKeys.checked)
  }

  // 表格字段
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id'
    },
    {
      title: '角色名称',
      dataIndex: 'roleName'
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button style={{margin:"0 10px"}} type="danger" shape="circle" icon={<DeleteOutlined />} onClick={()=>delConfirm(item)}></Button>
          <Button type="primary" shape="circle" onClick={()=>showModal(item)} icon={<UnorderedListOutlined />}></Button>
        </div>
      }
    }
  ]
  useEffect(() => {
    // 请求角色数据
    axios.get('/roles').then((res) => {
      setData(res.data)
    })
  }, [])
  useEffect(() => {
    // 请求权限数据
    axios.get('/rights?_embed=children').then((res) => {
      setTreeData(res.data)
    })
  }, [])
  
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
    // axios.delete(`/roles/${item.id}`)
  }


  return (
    <div>
      <Table dataSource={data} columns={columns} rowKey={(item) => item.id}></Table>
      <Modal title="权限分配" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Tree
          checkable
          checkStrictly
          checkedKeys={CurrentTreeData}
          onCheck={onCheck}
          treeData={treeData}
        />
      </Modal>
    </div>
  )
}
