import React, { Component } from 'react'
import { Row, Col } from 'antd'
import { Product } from '../components'


class Dashboard extends Component {
  constructor(props) {
  super(props)

    this.state = {
      
    }
  }

  render() {
    return (
      <>
        <h1>Dashboard</h1>
        <Row>
          <Col span={11}>
            <Product />
          </Col>
          <Col span={1} />
          <Col span={12}>
            <h2>Insight</h2>
          </Col>
        </Row>
      </>
    )
  }
}

export default Dashboard
