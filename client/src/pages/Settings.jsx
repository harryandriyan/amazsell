import React, { Component } from 'react'
import { Row, Col } from 'antd'
import { Tags } from '../components'


class Settings extends Component {

  render() {
    return (
      <>
        <h1>Settings</h1>
        <Row>
          <Col span={11}>
            <Tags />
          </Col>
          <Col span={1} />
          <Col span={12} />
        </Row>
      </>
    )
  }
}

export default Settings
