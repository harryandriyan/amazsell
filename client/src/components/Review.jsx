import React, { Component, Fragment } from 'react'
import { List, Avatar, Skeleton, Button, Form, Input, notification } from 'antd'


class Review extends Component {
  state = {
    review: []
  }
  render() {
    const { review } = this.state
    return (
      <Fragment>
        <h2>Review</h2>
        <div>
          <h3>Total Reviews Percentage All Products</h3>
          
        </div>
      </Fragment>
    )
  }
}

export default Review
