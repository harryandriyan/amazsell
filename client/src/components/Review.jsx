import React, { Component, Fragment } from 'react'
import { List, Rate, Skeleton, Select, notification } from 'antd'
import api from '../api'

const { Option } = Select

class Review extends Component {
  state = {
    data: [],
    loading: false,
    tagOption: []
  }
  
  componentDidMount() {
    this.getTags();
    this.getData()
  }

  getData = async() => {
    const { match: { params } } = this.props
    this.setState({ loading: true })

    await api.getReviewByASIN(params.asin).then(reviews => {
      this.setState({
        data: reviews.data.data,
        loading: false,
      })
    })
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
    const { data, loading, tagOption } = this.state
    return (
      <Fragment>
        <List
          className="demo-loadmore-list"
          itemLayout="vertical"
          size="large"
          loading={loading}
          dataSource={data}
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
                  style={{ width: '550px' }}
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
