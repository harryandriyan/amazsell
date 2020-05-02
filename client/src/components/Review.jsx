import React, { Component, Fragment } from 'react'
import { List, Rate, Switch, Skeleton, Select, Button, Row, Col, notification } from 'antd'
import api from '../api'

const { Option } = Select

class Review extends Component {
  state = {
    data: [],
    loading: false,
    tagOption: [],
    currentPage: 1,
    limit: 5,
    is_verified: false,
    score: 0,
  }
  
  componentDidMount() {
    const { currentPage } = this.state
    this.getTags()
    this.getData(currentPage)
  }

  getData = async (page) => {
    const { match: { params: { asin } } } = this.props
    this.setState({ loading: true })
    const params = {
      page,
      asin,
      limit: this.state.limit,
      is_verified: this.state.is_verified,
      score: this.state.score,
    }
    await api.getReviewByASIN(params).then(reviews => {
      let data = reviews.data.data
      const dataLength = data.length
      if (dataLength > 0) {
        data = page > 1 ? this.state.data.concat(data) : data
      } else {
        data = page > 1 ? this.state.data : data
      }

      this.setState({
        data,
        loading: false,
        currentPage: reviews.data.page,
        totalPages: reviews.data.totalPages
      })
      window.dispatchEvent(new Event('resize'))
    })
  }

  onLoadMore = () => {
    const { currentPage, totalPages } = this.state
    const nextPage = currentPage + 1
    if (nextPage <= totalPages) {
      this.getData(nextPage)
    }
  }

  getTags = async() => {
    await api.getAllTags().then(tags => {
      const tagOption = []
      tags.data.data.map((tag, i) => {
        tagOption.push(<Option key={i.toString(36) + i} value={tag.name}>{tag.name}</Option>)
      })
      this.setState({ tagOption })
    })
    
  }

  handleChangeTag = async(value, reviewId) => {
    const payload = {
      tags: value,
      id: reviewId
    }
    await api.updateReview(payload).then(res => {
      this.openNotification('success', 'Tags', 'Tags updated successfully')
    })
    .catch(error => {
      this.openNotification('error', 'Tags', error.message.name)
    })
  }

  filterList = (value, key) => {
    this.setState({ [key]: value }, () => {
      this.getData(1)
    })
  }

  clearFilter = () => {
    this.setState({
      is_verified: false,
      score:0 
    }, () => {
      this.getData(1)
    })
  }

  openNotification = (type, message, description) => {
    notification[type]({
      message,
      description
    })
  }

  render() {
    const { data, loading, tagOption, currentPage, totalPages, score, is_verified } = this.state
    const nextPage = currentPage + 1
    const loadMore =
      (!loading && nextPage <= totalPages && data.length > 0) ? (
        <div
          style={{
            textAlign: 'center',
            marginTop: 12,
            height: 32,
            lineHeight: '32px',
          }}
        >
          <Button onClick={this.onLoadMore}>load more reviews</Button>
        </div>
      ) : null
    return (
      <Fragment>
        <div>
          <h4>Filter</h4>
          <span>
            Show verified <Switch checked={is_verified} onChange={(checked) => this.filterList(checked, 'is_verified')} />
          </span>
          <span style={{ marginLeft: '20px' }}>
            Show by Stars <Rate value={score} onChange={(value) => this.filterList(value, 'score')} style={{ fontSize: '20px' }} />
          </span>
          <span style={{ float: 'right' }}>
            <Button onClick={this.clearFilter}>Clear Filter</Button>
          </span>
          <hr />
        </div>
        <List
          className="demo-loadmore-list"
          itemLayout="vertical"
          size="large"
          loading={loading}
          dataSource={data}
          loadMore={loadMore}
          renderItem={item => (
            <List.Item
              key={item._id}
              extra={
                <div>
                  <Rate disabled value={item.score} />
                  <h4>{item.author}</h4>
                  <div style={{ display: 'block' }}>
                    <div>{item.date}</div>
                    <div>{item.number_of_comment} comments</div>
                    <div>{item.number_of_vote} helpful votes</div>
                  </div>
                </div>
              }
              actions={[
                <Select
                  mode="multiple"
                  style={{ width: '450px' }}
                  placeholder="Add tags"
                  defaultValue={item.tags}
                  onChange={(value) => this.handleChangeTag(value, item._id)}
                >
                  {tagOption}
                </Select>
              ]}
            >
              <Skeleton avatar title={false} loading={item.loading} active>
                <List.Item.Meta
                  title={item.title}
                  description={`${item.body_copy} \n `}
                />
              </Skeleton>
            </List.Item>
          )}
        />
      </Fragment>
    )
  }
}

export default Review
