import React from 'react'
import { Link } from 'react-router-dom'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Layout, Menu } from 'antd'
import { Dashboard, About } from '../pages'
import 'antd/dist/antd.css'

const { Header, Footer, Content } = Layout


function App() {
  return (
    <Router>
      <Layout className="layout">
        <Header>
          <div className="logo" />
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
            <Menu.Item key="1">
              <Link to="/" className="nav-link">
                Dashboard
              </Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to="/about" className="nav-link">
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
            </Switch>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>AmazSell © 2020 Created by Harry</Footer>
      </Layout>
    </Router>
  )
}

export default App
