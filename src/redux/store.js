import { legacy_createStore as createStore,combineReducers } from 'redux'
import { CollapsedReducer } from './reducers/CollapsedReducer'
import { LoadingReducer } from './reducers/LoadingReducer'

// 持久化储存插件
import {persistStore, persistReducer} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

//在localStorge中生成key为root的值
const persistConfig = {
  key: 'root',
  storage,
  blacklist:['LoadingReducer']  //白名单或黑名单设置某个reducer数据不持久化
}

// 合并全部reducer
const reducers = combineReducers({
  CollapsedReducer,
  LoadingReducer
})

// reducers 被封装
const myPersistReducer = persistReducer(persistConfig, reducers)

// 创建store , 但是配置项被封装改变
const store = createStore(myPersistReducer)
// store 也被封装一份
const persistor = persistStore(store)

export {
  store,
  persistor
}

/* 
  原始 监听 订阅
  store.disptch()
  store.subsribe()
  引入 react-redux 可以父组件及容器组件
 */