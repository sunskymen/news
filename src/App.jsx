import React from "react"
import './App.css'
import IndexRouter from "./router/IndexRouter"
// 引入react-redux 帮助管理状态 , 自动分发store状态, 容器组件connect订阅跨级通信
import {Provider} from 'react-redux'
import { store, persistor } from './redux/store'
// redux持久化储存
import {PersistGate} from 'redux-persist/integration/react'

function App() {

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <IndexRouter></IndexRouter>
      </PersistGate>
    </Provider>
  )
}
export default App