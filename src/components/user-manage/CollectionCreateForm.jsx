import React, {useState,useRef} from 'react'
import { Modal, Form, Input, Select } from 'antd'
const {Option} = Select

// 抽离组件
const CollectionCreateForm = ({ open, onCreate, onCancel, regionList, roleList , title}) => {
  const [form] = Form.useForm()
  const [isDisable, setIsDisable] = useState(false)
  const regionRef = useRef()
  return (
    <Modal
      open={open}
      title= {title}
      okText="确定"
      cancelText="取消"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            onCreate(values);
          })
          .catch((info) => {
            console.log('Validate Failed:', info);
          });
      }}
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={{
          modifier: 'public',
        }}
        ref={regionRef}
      >
        <Form.Item
          name="username"
          label="用户名"
          rules={[
            {
              required: true,
              message: 'Please input the username of collection!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="密码"
          rules={[
            {
              required: true,
              message: 'Please input the password of collection!',
            },
          ]}
        >
          <Input type='password'/>
        </Form.Item>
        <Form.Item
          name="region"
          label="区域"
          rules={[
            {
              required: !isDisable,
              message: 'Please input the region of collection!',
            },
          ]}
        >
          <Select disabled={isDisable}>
            {
              regionList.map((item) => {
                return (
                  <Option value={item.value} key={item.id}>{ item.title }</Option>
                )
              })
            }
          </Select>
        </Form.Item>
        <Form.Item
          name="roleId"
          label="角色"
          rules={[
            {
              required: true,
              message: 'Please input the role of collection!',
            },
          ]}
        >
          <Select onChange={(value) => {
            if (value === 1) {
              // 是超级管理禁用并清空区域表单
              setIsDisable(true)
              regionRef.current.setFieldsValue({
                region:''
              })
            } else {
              setIsDisable(false)
            }
          }}>
            {
              roleList.map((item) => {
                return (
                  <Option value={item.id} key={item.id}>{ item.roleName }</Option>
                )
              })
            }
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CollectionCreateForm
