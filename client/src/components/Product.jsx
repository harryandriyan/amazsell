import React, { Component, Fragment } from 'react'
import { List, Avatar, Skeleton, Button, Modal, Form, Input, notification } from 'antd'
import {
  DeleteOutlined,
  EyeOutlined,
} from '@ant-design/icons'
import api from '../api'

class ProductList extends Component {
  state = {
    loading: false,
    data: [],
    modalVisible: false
  }

  componentDidMount() {
    this.getData()
  }

  getData = async() => {
    await api.getAllProduct().then(product => {
      this.setState({
        data: product.data.data,
        loading: false,
      })
    })
  }

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
      confirmLoading
    } = this.state

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
          renderItem={item => (
            <List.Item
              actions={[
                <a key="list-loadmore-show"><EyeOutlined /> See detail</a>, 
                <a key="list-loadmore-more"><DeleteOutlined style={{color: 'red'}} /></a>
              ]}
            >
              <Skeleton avatar title={false} loading={item.loading} active>
                <List.Item.Meta
                  avatar={
                    <Avatar src="https://images-na.ssl-images-amazon.com/images/G/01/rainier/available_at_amazon_1200x600_Nvz5h2M.png" />
                  }
                  title={<a href="https://ant.design">{item.asin}</a>}
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