import React,{useEffect, useState} from 'react'
import { Descriptions, PageHeader } from 'antd'
import { HeartTwoTone } from '@ant-design/icons'
import axios from 'axios'
import dayjs from 'dayjs'



export default function Detail(props) {
  // 保存新闻的信息
  const [newsData, setNewsData] = useState(null)

  useEffect(() => {
    const id = props.match.params.id
    axios.get(`/news?id=${id}&_expand=category&_expand=role`).then((res) => {
      const obj = res.data[0]
      setNewsData({
        ...obj,
        view:+obj.view + 1
      })

      return obj
    }).then((res) => {
      // 同步后端
      axios.patch(`/news/${id}`, {
        view:res.view + 1
      })
    })
  }, [props.match.params.id])
  
  // 点击喜欢处理事件
  const handleStar = () => {
    setNewsData({
      ...newsData,
      star: newsData.star + 1
    })
    // 同步后端
    axios.patch(`/news/${newsData.id}`, {
      star: newsData.star + 1
    })
  }

  return (
    <div>
      {
        newsData && <div className="site-page-header-ghost-wrapper">
        <PageHeader
          onBack={() => window.history.back()}
          title={newsData.title}
          subTitle={<div>{newsData.category.title} <HeartTwoTone twoToneColor="#eb2f96" onClick={()=>handleStar()} /></div>
            }
        >
          <Descriptions size="small" column={3} >
            <Descriptions.Item label="创建者">{newsData.author}</Descriptions.Item>
            <Descriptions.Item label="发布时间">{newsData.publishTime?dayjs(newsData.publishTime).format('YYYY-MM-DD HH:mm:ss'):'-'}</Descriptions.Item>
            <Descriptions.Item label="区域">{newsData.region}</Descriptions.Item>
            <Descriptions.Item label="访问数量">{newsData.view}</Descriptions.Item>
            <Descriptions.Item label="点赞数量">{newsData.star}</Descriptions.Item>
            <Descriptions.Item label="评论数量">{newsData.comment?newsData.comment:0}</Descriptions.Item>
          </Descriptions>
          </PageHeader>

          <Descriptions bordered layout="vertical" >
            <Descriptions.Item label="新闻内容" labelStyle={{fontSize:'20px'}}>
              <div dangerouslySetInnerHTML={{ __html: newsData.content }}></div>
            </Descriptions.Item>
          </Descriptions>
      </div>
      }
    </div>
  )
}
