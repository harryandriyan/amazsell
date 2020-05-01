import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'
import { List, Avatar, Skeleton, Button, Modal, Form, Input, Popconfirm, notification } from 'antd'
import {
  DeleteOutlined,
  EyeOutlined,
} from '@ant-design/icons'
import api from '../api'

class ProductList extends Component {
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
    await api.getAllProduct(params).then(product => {
      if (product.data.data.length > 0) {
        const data = this.state.data.concat(product.data.data);
        this.setState({
          data,
          loading: false,
          currentPage: product.data.page,
          totalPages: product.data.totalPages
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
    await api.insertProduct(values).then(res => {
      this.openNotification('success', 'Product', 'Product inserted successfully')
      this.getData()
      this.setState({
        confirmLoading: false,
        modalVisible: false
      })
    })
    .catch(error => {
      this.openNotification('error', 'Product', error.message.name)
    })
  }

  handleDelete = async (id) => {
    await api.deleteProductById(id).then(res => {
      this.openNotification('success', 'Product', 'Product deleted successfully')
      this.getData(this.state.currentPage)
    })
    .catch(error => {
      this.openNotification('error', 'Product', error.message.name)
    })
  }
  
  cancelDelete = () => {
    this.openNotification('info', 'Product', 'Delete Product canceled')
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
          <Button onClick={this.onLoadMore}>load more products</Button>
        </div>
      ) : null

    return (
      <Fragment>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h2>Product List</h2>
          <Button type="primary pull-right" onClick={this.toggleModal}>
            Add Product
          </Button>
          <Modal
            title="Add Product"
            visible={modalVisible}
            confirmLoading={confirmLoading}
            footer={[
              <Button key="back" onClick={this.toggleModal}>
                Cancel
              </Button>,
              <Button form="productForm" key="submit" type="primary" htmlType="submit" loading={confirmLoading}>
                Save Product
              </Button>,
            ]}
          >
            <Form
              name="basic"
              id="productForm"
              onFinish={this.handleAdd}
            >
              <Form.Item
                label="Link"
                name="productLink"
                rules={[
                  {
                    required: true,
                    message: 'Please input the product link!',
                  },
                ]}
              >
                <Input placeholder="https://amazon.com/....." />
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
                <Link to={`/product/${item.asin}`} key="list-loadmore-show"><EyeOutlined /> See detail</Link>, 
                <Popconfirm
                  title="Are you sure delete this product?"
                  onConfirm={() => this.handleDelete(item._id)}
                  onCancel={this.cancelDelete}
                  okText="Yes"
                  cancelText="No"
                >
                  <a key="list-loadmore-more"><DeleteOutlined style={{color: 'red'}} /></a>
                </Popconfirm>
              ]}
            >
              <Skeleton avatar title={false} loading={item.loading} active>
                <List.Item.Meta
                  avatar={
                    <Link to={`/product/${item.asin}`}>
                      <Avatar src="https://images-na.ssl-images-amazon.com/images/G/01/rainier/available_at_amazon_1200x600_Nvz5h2M.png" />
                    </Link>
                  }
                  title={<Link to={`/product/${item.asin}`}>{item.asin}</Link>}
                  description={`${item.name} \n ${item.price} \n Rating: ${item.rating}`}
                />
              </Skeleton>
            </List.Item>
          )}
        />
      </Fragment>
    )
  }
}

export default ProductList;