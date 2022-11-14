import NewsPublish from '../../../components/publish-manage/NewsPublish'
import usePublish from '../../../components/publish-manage/usePublish'

export default function Sunset() {
  // 已下线
  const {data} = usePublish(3)
  return (
    <div>
      <NewsPublish dataSource={data} PublishType={3}></NewsPublish>
    </div>
  )
}
