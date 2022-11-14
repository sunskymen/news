// "react-router-dom": "^5.3.4"
import React from 'react'
import { HashRouter,Route, Switch, Redirect } from 'react-router-dom'
import NewsSandBox from '../views/sandbox/NewsSandBox'
import Login from '../views/login/Login'
import News from '../views/news/News'
import Detail from '../views/news/Detail'


export default function IndexRouter() {

  return (
    <HashRouter>
      <Switch>
        <Route path='/login' component={Login}></Route>
        {/* 游客路由 */}
        <Route path='/news' component={News}></Route>
        <Route path='/detail/:id' component={Detail}></Route>
        {/* <Route path='/' component={NewsSandBox}></Route> */}
        <Route path='/' render={() => 
          localStorage.getItem("token") ? <NewsSandBox></NewsSandBox> : <Redirect to='/login' />
        }></Route>
      </Switch>
    </HashRouter>
  )
}
