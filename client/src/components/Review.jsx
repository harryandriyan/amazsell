import React, { Component, Fragment } from 'react'
import { List, Rate, Skeleton, Select, Button, notification } from 'antd'
import api from '../api'

const { Option } = Select

class Review extends Component {
  state = {
    data: [],
    loading: false,
    tagOption: [],
    currentPage: 1,
    limit: 5
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
      limit: this.state.limit
    }
    await api.getReviewByASIN(params).then(reviews => {
      if (reviews.data.data.length > 0) {
        const data = this.state.data.concat(reviews.data.data);
        this.setState({
          data,
          loading: false,
          currentPage: reviews.data.page,
          totalPages: reviews.data.totalPages
        })
        window.dispatchEvent(new Event('resize'))
      }
    })
  }

  onLoadMore = () => {
    const { currentPage, totalPages } = this.state
    const nextPage = currentPage + 1
    if (nextPage <= totalPages) {
      this.getData(nextPage)
    }
  };

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
      this.openNotification('success', 'Tags', 'Tags inserted successfully')
    })
    .catch(error => {
      this.openNotification('error', 'Tags', error.message.name)
    })
  }

  openNotification = (type, message, description) => {
    notification[type]({
      message,
      description
    });
  };

  render() {
    const { data, loading, tagOption, currentPage, totalPages } = this.state
    const nextPage = currentPage + 1
    const loadMore =
      (!loading && nextPage <= totalPages) ? (
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
                  <Rate disabled defaultValue={item.score} />
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
