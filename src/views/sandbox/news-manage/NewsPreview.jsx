import React,{useEffect, useState} from 'react'
import { Descriptions, PageHeader } from 'antd'
import axios from 'axios'
import dayjs from 'dayjs'



export default function NewsUpdate(props) {
  // 保存新闻的信息
  const [newsData, setNewsData] = useState(null)

  useEffect(() => {
    const id = props.match.params.id
    axios.get(`/news?id=${id}&_expand=category&_expand=role`).then((res) => {
      setNewsData(res.data[0])
    })
  }, [props.match.params.id])
  
  // 发布状态,审核状态的数组映射, 及字体颜色映射
  const auditMap = ['未审核', '审核中', '已通过', '未通过']
  const publishMap = ['未发布', '待发布', '已上线', '已下线']
  const colorList = ['black', 'orange','green','red']
  return (
    <div>
      {
        newsData && <div className="site-page-header-ghost-wrapper">
        <PageHeader
          onBack={() => window.history.back()}
          title={newsData.title}
          subTitle={newsData.category.title}
        >
          <Descriptions size="small" column={3} >
            <Descriptions.Item label="创建者">{newsData.author}</Descriptions.Item>
            <Descriptions.Item label="创建时间">{dayjs(newsData.createTime).format('YYYY-MM-DD HH:mm:ss')}</Descriptions.Item>
            <Descriptions.Item label="发布时间">{newsData.publishTime?dayjs(newsData.publishTime).format('YYYY-MM-DD HH:mm:ss'):'-'}</Descriptions.Item>
            <Descriptions.Item label="区域">{newsData.region}</Descriptions.Item>
            <Descriptions.Item label="审核状态" contentStyle={{color:colorList[newsData.auditState]}}>{auditMap[newsData.auditState]}</Descriptions.Item>
            <Descriptions.Item label="发布状态" contentStyle={{color:colorList[newsData.publishState]}}>{publishMap[newsData.publishState]}</Descriptions.Item>
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
