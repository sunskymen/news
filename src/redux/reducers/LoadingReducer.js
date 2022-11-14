// 管理loading的显示与隐藏  reducer纯函数

// 初始状态
const initState = {
  loading: false
}
export const LoadingReducer = (prevState=initState, action) => {
  let { type,payload } = action
  switch (type) {
    case 'change_loading':
      let newState = { ...prevState }
      newState.loading = payload
      return newState
    default:
      return prevState
  }
}