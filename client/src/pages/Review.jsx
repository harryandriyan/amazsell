import React, { Component, Fragment } from 'react'
import { Row, Col, Button, Progress } from 'antd'
import { 
  Review as ReviewComponent, 
  Summary as SummaryComponent 
} from '../components'
import api from '../api'


class Review extends Component {
  state = {
    isHasReview: false,
    loading: false,
    percent: 0,
    reviewStarted: false,
  }

  componentDidMount() {
    this.getData()
  }

  startTimer = () => {
    if(!this.timerId) {     
      this.timerId = setInterval(() => {
        if (this.state.percent < 100) {
          this.setState({ percent: this.state.percent + 2 })
        }
      }, 500)
    }
  }
  
  stopTimer = () => {
    clearInterval(this.timerId)
    this.setState({ loading: false, percent: 100 })
    setTimeout(() => {
      window.location.reload()
    }, 1500)
  }

  getData = async() => {
    const { match: { params } } = this.props

    await api.getReviewCountByASIN(params.asin).then(reviews => {
      this.setState({
        isHasReview: reviews.data.count > 0,
      })
    })
  }

  getReviewsData = async() => {
    this.startTimer()
    this.setState({ loading: true, reviewStarted: true })
    const { match: { params: { asin } } } = this.props

    await api.generateReview(asin).then(response => {
      this.stopTimer()
    });
  }

  generateReviewSection = () => {
    const { loading } = this.state
    return (
      <Row>
        <Col span={24}>
          <h3 style={{ textAlign: 'center' }}>This product doesn't has a review data yet</h3>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button 
              type="primary" loading={loading} 
              onClick={() => this.getReviewsData()}
            >
              Click here to get the reviews!
            </Button>
          </div>
          {this.state.reviewStarted && (
            <div style={{ display: 'block', textAlign: 'center', marginTop: '20px' }}>
              <Progress type="circle" percent={this.state.percent} />
              <div>This may take several time to finished</div>
            </div>
          )}
        </Col>
      </Row>
    )
  }

  render() {
    const { isHasReview } = this.state
    return (
      <Fragment>
        {isHasReview ? (
          <Row>
            <Col span={14}>
              <h1>Review </h1>
              <ReviewComponent {...this.props} />
            </Col>
            <Col span={1} />
            <Col span={9}>
              <h1>Summary </h1>
              <SummaryComponent {...this.props} />
            </Col>
          </Row>
        ) : this.generateReviewSection()}
      </Fragment>
    )
  }
}

export default Review