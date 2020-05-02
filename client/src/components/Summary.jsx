import React, { Component, Fragment } from 'react'
import { Progress } from 'antd'
import {
  StarFilled,
} from '@ant-design/icons'
import api from '../api'

class Review extends Component {
  state = {
    data: [],
    loading: false
  }
  
  componentDidMount() {
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

  render() {
    return (
      <Fragment>
        <table border="0" cellPadding={5} cellSpacing={5}>
          <thead>
            <tr>
              <th width="15%">All <StarFilled style={{ color: '#fadb33', fontSize: '16px' }} /></th>
              <th width="35%"><Progress style={{ height: '30px' }} percent={100} showInfo={false} /></th>
              <th width="10%">85</th>
              <th width="10%">33</th>
              <th width="10%">53</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>5</strong> <StarFilled style={{ color: '#fadb33', fontSize: '16px' }} /></td>
              <td><Progress percent={80} showInfo={false} /></td>
              <td>30</td>
              <td>10</td>
              <td>20</td>
            </tr>
            <tr>
              <td><strong>4</strong> <StarFilled style={{ color: '#fadb33', fontSize: '16px' }} /></td>
              <td><Progress percent={60} showInfo={false} /></td>
              <td>25</td>
              <td>10</td>
              <td>15</td>
            </tr>
            <tr>
              <td><strong>3</strong> <StarFilled style={{ color: '#fadb33', fontSize: '16px' }} /></td>
              <td><Progress percent={40} showInfo={false} /></td>
              <td>15</td>
              <td>5</td>
              <td>10</td>
            </tr>
            <tr>
              <td><strong>2</strong> <StarFilled style={{ color: '#fadb33', fontSize: '16px' }} /></td>
              <td><Progress percent={25} showInfo={false} /></td>
              <td>10</td>
              <td>5</td>
              <td>5</td>
            </tr>
            <tr>
              <td><strong>1</strong> <StarFilled style={{ color: '#fadb33', fontSize: '16px' }} /></td>
              <td><Progress percent={10} showInfo={false} /></td>
              <td>5</td>
              <td>3</td>
              <td>2</td>
            </tr>
          </tbody>
        </table>
      </Fragment>
    )
  }
}

export default Review
