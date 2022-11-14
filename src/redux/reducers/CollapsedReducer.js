// 管理侧边折叠 reducer纯函数

// 初始状态
const initState = {
  isCollapsed: false
}
export const CollapsedReducer = (prevState=initState, action) => {
  let { type } = action
  switch (type) {
    case 'change_collapsed':
      let newState = { ...prevState }
      newState.isCollapsed = !newState.isCollapsed
      return newState
    default:
      return prevState
  }
}