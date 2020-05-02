import React, { Component, Fragment } from 'react'
import { Row, Col, Button, Progress, Rate } from 'antd'
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
    product: null,
  }

  componentDidMount() {
    this.getData()
    this.getProduct()
  }

  startTimer = () => {
    if(!this.timerId) {     
      this.timerId = setInterval(() => {
        if (this.state.percent < 100) {
          this.setState({ percent: this.state.percent + 1 })
        }
      }, 1000)
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

  getProduct = async() => {
    const { match: { params } } = this.props

    await api.getProductByASIN(params.asin).then(product => {
      this.setState({
        product: product.data.data,
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
    const { isHasReview, product } = this.state
    return (
      <Fragment>
        <Row>
          <Col span={24}>
            <h2>Product Detail</h2>
          </Col>
          {product && (
            <Col span={24}>
              <a href={product.link} target="_blank">
                <h3>{product.asin} - {product.name}</h3>
              </a>
              <p>{product.description}</p>
              <strong style={{ color: 'blue', marginRight: '15px' }}>{product.price}</strong>
              <Rate disabled allowHalf defaultValue={product.rating} />
              <span style={{ marginLeft: '15px' }}>{product.rating}</span>
            </Col>
          )}
        </Row>
        <hr />
        {isHasReview ? (
          <Row style={{marginTop: '20px'}}>
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
