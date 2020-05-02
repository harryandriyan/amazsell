import React from 'react'
import { Link } from 'react-router-dom'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Layout, Menu } from 'antd'
import {
  HomeFilled,
  SmileFilled,
  SettingFilled
} from '@ant-design/icons';
import { Dashboard, About, Review, Settings } from '../pages'
import 'antd/dist/antd.css'

const { Header, Footer, Content } = Layout


function App() {
  return (
    <Router>
      <Layout className="layout">
        <Header>
          <div className="logo" />
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
            <Menu.Item key="1">
              <Link to="/" className="nav-link">
                <HomeFilled />
                Dashboard
              </Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to="/settings" className="nav-link">
                <SettingFilled />
                Settings
              </Link>
            </Menu.Item>
            <Menu.Item key="3">
              <Link to="/about" className="nav-link">
                <SmileFilled />
                About
              </Link>
            </Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: '20px 50px' }}>
          <div className="site-layout-content" style={{ padding: '20px', background: '#fff', borderRadius: '8px' }}>
            <Switch>
              <Route path="/" exact component={Dashboard} />
              <Route path="/about" exact component={About} />
              <Route path="/settings" exact component={Settings} />
              <Route path="/product/:asin" exact component={Review} />
            </Switch>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>AmazSell © 2020 Created by Harry</Footer>
      </Layout>
    </Router>
  )
}

export default App
