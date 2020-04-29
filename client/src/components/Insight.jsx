import React, { Component, Fragment } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';


class Insight extends Component {
  state = {
    data: [
      { name: '🌟', total: 1 },
      { name: '🌟🌟', total: 3 },
      { name: '🌟🌟🌟', total: 5 },
      { name: '🌟🌟🌟🌟', total: 25 },
      { name: '🌟🌟🌟🌟🌟', total: 73 },
    ]
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
