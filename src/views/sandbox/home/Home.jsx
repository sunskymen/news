import React, {useEffect, useState, useRef} from 'react'
import { Card, Col, Row, List, Avatar, Drawer } from 'antd'
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons'
import axios from 'axios'
import * as echarts from 'echarts'
import _ from 'lodash'
const { Meta } = Card;

export default function Home() {
  // 获取当前用户信息
  const {username,region, role:{roleName}} = JSON.parse(localStorage.getItem('token'))
  // 用户最常浏览列表
  const [viewList, setViewList] = useState([])
  // 用户点赞最多列表
  const [likeList, setLikeList] = useState([])
  const barRef = useRef()
  const pieRef = useRef()
  const [drawerOpen, setDrawerOpen] = useState(false)
  // 判断是否存在, 防止多次渲染
  const [pieCharts, setPieCharts] = useState(null)
  const [allList, setallList] = useState([])

  // 获取后端数据
  useEffect(() => {
    // 已发布 - 联表分类 - view字段排序 - 降序 - 前六
    axios.get(`/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6`).then((res) => {
      setViewList(res.data)
    })
  }, [])
  useEffect(() => {
    // 已发布 - 联表分类 - star字段排序 - 降序 - 前六
    axios.get(`/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6`).then((res) => {
      setLikeList(res.data)
    })
  }, [])

  // 柱状图初始化
  useEffect(() => {
    axios.get(`/news?publishState=2&_expand=category`).then((res) => {
      initBar(_.groupBy(res.data, item => item.category.title))
      setallList(res.data)
    })

    // 组件销毁时清除事件
    return () => {
      window.onresize = null
    }
  }, [])
  // 初始化柱状图方法
  const initBar = (obj) => {
    // 基于准备好的dom，初始化echarts实例
    const myChart = echarts.init(barRef.current);
    // 指定图表的配置项和数据
    const option = {
        title: {
          text: '新闻分类图示'
        },
        tooltip: {},
        legend: {
          data: ['数量']
        },
        xAxis: {
          data: Object.keys(obj)
        },
        yAxis: {
          minInterval:1
        },
        series: [
          {
            name: '数量',
            type: 'bar',
            data: Object.values(obj).map(item=>item.length)
          }
        ]
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
    window.onresize = () => {
      myChart.resize()
    }
  }
  // 初始化饼图
  const initPie = () => {
    const myList = allList.filter(item => item.author === username)
    const obj = _.groupBy(myList, item => item.category.title)
    let list = []
    for (let i in obj) {
      list.push({
        value:obj[i],
        name:i
      })
    }
    let myChart;
    if (!pieCharts) {
      myChart = echarts.init(pieRef.current)
      setPieCharts(myChart)
    } else {
      myChart = pieCharts
    }
    const option = {
      title: {
        text: '当前用户',
        // subtext: 'Fake Data',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: '发布数量',
          type: 'pie',
          radius: '50%',
          data: list,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
    myChart.setOption(option);
  }


  return (
    <div className="site-card-wrapper">
    <Row gutter={16}>
      <Col span={8}>
        <Card title="用户最常浏览" bordered>
        <List
          size="small"
          dataSource={viewList}
          renderItem={(item) => <List.Item><a href={`#/news-manage/preview/${item.id}`}>{item.title}</a></List.Item>}
        />
        </Card>
      </Col>
      <Col span={8}>
        <Card title="用户点赞最多" bordered>
          <List
            size="small"
            dataSource={likeList}
            renderItem={(item) => <List.Item><a href={`#/news-manage/preview/${item.id}`}>{item.title}</a></List.Item>}
          />
        </Card>
      </Col>
      <Col span={7}>
        <Card
          cover={
            <img
              alt="example"
              src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
        />
          }
          actions={[
            <SettingOutlined key="setting" onClick={() => {
              setTimeout(() => {
                setDrawerOpen(true)
                initPie()
              }, 0);
            }} />,
            <EditOutlined key="edit" />,
            <EllipsisOutlined key="ellipsis" />,
          ]}
        >
          <Meta
            avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
            title={username}
            description={
              <div>
                <b>{region ? region : '全球'}- { roleName }</b>
              </div>
            }
          />
        </Card>
      </Col>
      </Row>
      <Drawer width='500px' title="个人新闻分类" placement="right" onClose={()=>{ setDrawerOpen(false)}} open={drawerOpen}>
        <div ref={pieRef} style={{ width: '100%', height: '100%' }}></div>
      </Drawer>
      
      <div ref={barRef} style={{ width: '100%', height: '400px',marginTop:'50px' }}></div>
  </div>
  )
}
