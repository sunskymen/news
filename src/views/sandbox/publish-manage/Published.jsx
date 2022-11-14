import NewsPublish from '../../../components/publish-manage/NewsPublish'
import usePublish from '../../../components/publish-manage/usePublish'


export default function Published() {
  // 已发布
  const {data} = usePublish(2)
  return (
    <div>
      <NewsPublish dataSource={data} PublishType={2}></NewsPublish>
    </div>
  )
}

