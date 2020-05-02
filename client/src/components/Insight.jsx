import React, { Component, Fragment } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import api from '../api'


class Insight extends Component {
  state = {
    data: [
      { name: '🌟', total: 0 },
      { name: '🌟🌟', total: 0 },
      { name: '🌟🌟🌟', total: 0 },
      { name: '🌟🌟🌟🌟', total: 0 },
      { name: '🌟🌟🌟🌟🌟', total: 0 },
    ]
  }

  componentDidMount() {
    this.getData()
  }

  getData = async() => {
    await api.getReviewInsight().then(reviews => {
      this.setState({
        data: reviews.data.data,
      })
    })
  }

  render() {
    const { data } = this.state
    return (
      <Fragment>
        <h2>Insight</h2>
        <div>
          <h3>Total Reviews Percentage All Products</h3>
          <BarChart
            width={650}
            height={350}
            data={data}
            margin={{
              top: 5, right: 30, left: 20, bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" fill="#1f8ffb" />
          </BarChart>
        </div>
      </Fragment>
    )
  }
}

export default Insight
