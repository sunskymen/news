import React, {useEffect, useState,useRef, useContext} from 'react'
import { Table ,Button, Modal,Input,Form } from 'antd'
import {DeleteOutlined,ExclamationCircleOutlined } from '@ant-design/icons'
import axios from 'axios'
const { confirm } = Modal

export default function NewsCategory() {

  // 请求新闻分类
  const [data,setData] = useState([])
  useEffect(() => {
    axios.get('/categories').then((res) => {
      const list = res.data
      setData(list)
    })
  }, [])
  
  // 表格展示字段
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id'
    },
    {
      title: '栏目名称',
      dataIndex: 'title',
      render: (title) => {
        return <div>{title}</div>
      },
      onCell: (record) => ({
        record,
        editable: true,
        dataIndex: 'title',
        title: '栏目名称',
        handleSave,
      }),
  },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button style={{margin:"0 10px"}} type="danger" shape="circle" icon={<DeleteOutlined />} onClick={()=>{delConfirm(item)}}></Button>
        </div>
      }
    }
  ]

  const EditableContext = React.createContext(null);
  // 可编辑的行
  const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
      <Form form={form} component={false}>
        <EditableContext.Provider value={form}>
          <tr {...props} />
        </EditableContext.Provider>
      </Form>
    );
  };
  // 可编辑的列
  const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
  }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    useEffect(() => {
      if (editing) {
        inputRef.current.focus();
      }
    }, [editing]);
    const toggleEdit = () => {
      setEditing(!editing);
      form.setFieldsValue({
        [dataIndex]: record[dataIndex],
      });
    };
    const save = async () => {
      try {
        const values = await form.validateFields();
        toggleEdit();
        handleSave({
          ...record,
          ...values,
        });
      } catch (errInfo) {
        console.log('Save failed:', errInfo);
      }
    };
    let childNode = children;
    if (editable) {
      childNode = editing ? (
        <Form.Item
          style={{
            margin: 0,
          }}
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `${title} is required.`,
            },
          ]}
        >
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        </Form.Item>
      ) : (
        <div
          className="editable-cell-value-wrap"
          style={{
            paddingRight: 24,
          }}
          onClick={toggleEdit}
        >
          {children}
        </div>
      );
    }
    return <td {...restProps}>{childNode}</td>;
  };

  // 失去焦点处理函数
  const handleSave = (record) => {
    setData(data.map(item => {
      if (item.id === record.id) {
        return {
          ...record,
          value:record.title
        }
      } else {
        return item
      }
    }))
    // 更新后端数据
    axios.patch(`categories/${record.id}`, {
      title: record.title,
      value: record.title
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
        axios.delete(`/categories/${item.id}`)
    }
  
  return (
    <div>
      <Table dataSource={data} columns={columns} pagination={{
        pageSize: 5
      }} rowKey={(item)=>item.id } components={{
        body: {
          row: EditableRow,
          cell: EditableCell,
        }
      }} />
    </div>
  )
}

