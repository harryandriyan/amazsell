import React, { Component, Fragment } from 'react'
import { List, Skeleton, Button, Modal, Form, Input, Popconfirm, notification } from 'antd'
import { DeleteFilled } from '@ant-design/icons'
import api from '../api'

class TagsList extends Component {
  state = {
    loading: false,
    data: [],
    modalVisible: false,
    currentPage: 1,
    limit: 5
  }

  componentDidMount() {
    const { currentPage } = this.state
    this.getData(currentPage)
  }

  getData = async (page) => {
    this.setState({ loading: true })
    const params = {
      page,
      limit: this.state.limit
    }
    await api.getAllTags(params).then(tags => {
      if (tags.data.data.length > 0) {
        const data = page === 1 ? tags.data.data : this.state.data.concat(tags.data.data);
        this.setState({
          data,
          loading: false,
          currentPage: tags.data.page,
          totalPages: tags.data.totalPages
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

  toggleModal = () => {
    this.setState(prevState => ({
      modalVisible: !prevState.modalVisible,
      confirmLoading: false
    }));
  }

  handleAdd = async (values) => {
    this.setState({
      confirmLoading: true,
    });
    await api.insertTags(values).then(res => {
      this.openNotification('success', 'Tags', res.data.message)
      this.getData(this.state.currentPage)
      this.setState({
        confirmLoading: false,
        modalVisible: false
      })
    })
    .catch(error => {
      this.openNotification('error', 'Tags', error.message.message)
    })
  }

  handleDelete = async (id) => {
    await api.deleteTagsById(id).then(res => {
      this.openNotification('success', 'Tags', 'Tags deleted successfully')
      this.getData(1)
    })
    .catch(error => {
      this.openNotification('error', 'Tags', error.message.name)
    })
  }
  
  cancelDelete = () => {
    this.openNotification('info', 'Tags', 'Delete Tags canceled')
  }

  openNotification = (type, message, description) => {
    notification[type]({
      message,
      description
    });
  };

  render() {
    const { 
      loading, 
      data,
      modalVisible,
      confirmLoading,
      totalPages,
      currentPage
    } = this.state

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
          <Button onClick={this.onLoadMore}>load more tags</Button>
        </div>
      ) : null

    return (
      <Fragment>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h2>Manage Tags</h2>
          <Button type="primary pull-right" onClick={this.toggleModal}>
            Add Tags
          </Button>
          <Modal
            title="Add Tags"
            visible={modalVisible}
            confirmLoading={confirmLoading}
            footer={[
              <Button key="back" onClick={this.toggleModal}>
                Cancel
              </Button>,
              <Button form="tagsForm" key="submit" type="primary" htmlType="submit" loading={confirmLoading}>
                Save Tags
              </Button>,
            ]}
          >
            <Form
              name="basic"
              id="tagsForm"
              onFinish={this.handleAdd}
            >
              <Form.Item
                label="Tag"
                name="name"
                rules={[
                  {
                    required: true,
                    message: 'Please input the tags link!',
                  },
                ]}
              >
                <Input placeholder="To small" />
              </Form.Item>
            </Form>
          </Modal>
        </div>
        <List
          className="demo-loadmore-list"
          loading={loading}
          itemLayout="horizontal"
          dataSource={data}
          loadMore={loadMore}
          renderItem={item => (
            <List.Item
              actions={[
                <Popconfirm
                  title="Are you sure delete this tags?"
                  onConfirm={() => this.handleDelete(item._id)}
                  onCancel={this.cancelDelete}
                  okText="Yes"
                  cancelText="No"
                >
                  <a key="list-loadmore-more"><DeleteFilled style={{color: 'red'}} /></a>
                </Popconfirm>
              ]}
            >
              <Skeleton avatar title={false} loading={item.loading} active>
                <List.Item.Meta
                  title={item.name}
                />
              </Skeleton>
            </List.Item>
          )}
        />
      </Fragment>
    )
  }
}

export default TagsList;