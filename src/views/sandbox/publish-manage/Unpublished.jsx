import React from 'react'

import NewsPublish from '../../../components/publish-manage/NewsPublish'
import usePublish from '../../../components/publish-manage/usePublish'

export default function Unpublished() {
  // 待发布
  const {data} = usePublish(1)
  return (
    <div>
      <NewsPublish dataSource={data} PublishType={1}></NewsPublish>
    </div>
  )
}
