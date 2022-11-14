import React, {useEffect, useState, useRef} from 'react'
import {PageHeader,Steps,Button,Form,Input,Select,message,notification} from 'antd'
import style from './news.module.css'
import axios from 'axios'
import NewsEditor from '../../../components/news-manage/NewsEditor'
const {Option} = Select

// 步骤项
const stepsItem = [
  {
    title: '基本信息',
    description:'新闻标题 , 新闻分类',
  },
  {
    title: '新闻内容',
    description:'新闻主题内容',
  },
  {
    title: '新闻提交',
    description:'保存草稿或提交审核',
  },
]

export default function NewsAdd(props) {
  // 当前步骤进度
  const [currentStep, setCurrentStep] = useState(0)
  // 新闻分类的选择列表
  const [newsCategoryList, setNewsCategoryList] = useState([])
  // 保存标题及分类
  const [formInfo, setFormInfo] = useState({})
  // 保存新闻内容
  const [newsContent,setNewsContent] = useState('')
  const formRef = useRef(null)
      // 获取新闻的信息并设初始值
      useEffect(() => {
        const id = props.match.params.id
        axios.get(`/news?id=${id}&_expand=category&_expand=role`).then((res) => {
          const {title, categoryId,content} = res.data[0]
          // 通过表单的ref 设置初始值
          formRef.current.setFieldsValue({
            "title": title,
            "categoryId":categoryId
          })
          // 设置内容
          setNewsContent(content)
        })
      }, [props.match.params.id])
  // 点击下一步
  const handleNext = () => {
    // 第一步时需要校验表单
    if (currentStep===0) {
      formRef.current.validateFields().then((res) => {
        setFormInfo(res)
        setCurrentStep(currentStep+1)
      }).catch((res) => {
        console.log(res)
      })
    } else {
      if (newsContent === '' || newsContent.trim() === '<p></p>') {
        message.warning('请输入新闻内容')
      } else {
        setCurrentStep(currentStep+1)
      }
    }
  }
  // 点击上一步
  const handlePrevious = () => {
    setCurrentStep(currentStep-1)
  }
  // 点击保存草稿
  const handleSave = (auditState) => {
    // 整理参数给后端添加
    axios.patch(`/news/${props.match.params.id}`, {
      ...formInfo,
      "content": newsContent,
      "auditState": auditState,
      // "publishTime": 0
    }).then((res) => {
      // 成功跳转页面
      props.history.push(auditState === 0 ? '/news-manage/draft' : '/audit-manage/list')
      notification.info({
        message: '提示',
        description:
          auditState === 0 ? '您可以到草稿箱中查看' : '您可以到审核列表中查看',
          placement:'bottomRight'
      });
    })
  }
  // 获取新闻分类数据
  useEffect(() => {
    axios.get('/categories').then((res) => {
      setNewsCategoryList(res.data)
    })
  }, [])

  return (
      <div>
        <PageHeader
          onBack={() => window.history.back()}
          className="site-page-header"
          title="编辑新闻"
          subTitle="This is a subtitle"
        />
        <Steps
          current={currentStep}
          items={stepsItem}
          style={{ marginBottom: '50px' }}
        />
  
        {/* 内容区域 */}
        <div className={currentStep === 0 ? '' : style.active}>
        <Form name="basic" labelCol={{ span:2}} wrapperCol={{span: 5}}
        autoComplete="off" ref={formRef}
      >
        <Form.Item label="新闻标题" name="title" rules={[
            {
              required: true,
              message: 'Please input your title!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="新闻分类" name="categoryId" rules={[
            {
              required: true,
              message: 'Please input your category!',
            },
          ]}
        >
              <Select>
                {
                  newsCategoryList.map((item) => {
                    return <Option value={item.id} key={item.id}>{ item.title }</Option>
                  })
                }
          </Select>
        </Form.Item>
          </Form>
        </div>
  
        <div className={currentStep === 1 ? '' : style.active}>
          <NewsEditor getContent={(value) => {setNewsContent(value)}} content={newsContent}></NewsEditor>
        </div>
  
        
        <div style={{ marginTop: '50px' }}>
          {
            currentStep === 2 && <span>
              <Button type='primary' onClick={()=>handleSave(0)}>保存草稿箱</Button>
              <Button danger onClick={()=>handleSave(1)}>提交审核</Button>
            </span>
          }
          {
            currentStep<2 && <Button type='primary' onClick={handleNext}>下一步</Button>
          }
          {
            currentStep>0 && <Button onClick={handlePrevious}>上一步</Button>
          }
          
        </div>
      </div>
  )
}
