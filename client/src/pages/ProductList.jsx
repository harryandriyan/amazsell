import React, { Component } from 'react'
import ReactTable from 'react-table'
import api from '../api'

import styled from 'styled-components'

import 'react-table/react-table.css'

const Wrapper = styled.div`
  padding: 0 40px 40px 40px;
`

const Update = styled.div`
  color: #ef9b0f;
  cursor: pointer;
`

const Delete = styled.div`
  color: #ff0000;
  cursor: pointer;
`

class UpdateMovie extends Component {
  updateUser = event => {
    event.preventDefault()

    window.location.href = `/product/update/${this.props.id}`
  }

  render() {
    return <Update onClick={this.updateUser}>Update</Update>
  }
}

class DeleteMovie extends Component {
  deleteUser = event => {
    event.preventDefault()

    if (
      window.confirm(
        `Do tou want to delete the movie ${this.props.id} permanently?`,
      )
    ) {
      api.deleteMovieById(this.props.id)
      window.location.reload()
    }
  }

  render() {
    return <Delete onClick={this.deleteUser}>Delete</Delete>
  }
}

class ProductList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      product: [],
      columns: [],
      isLoading: false,
    }
  }

  componentDidMount = async () => {
    this.setState({ isLoading: true })

    await api.getAllProduct().then(product => {
      this.setState({
        product: product.data.data,
        isLoading: false,
      })
    })
  }

  render() {
    const { product, isLoading } = this.state

    const columns = [
      {
        Header: 'ID',
        accessor: '_id',
        filterable: true,
      },
      {
        Header: 'Name',
        accessor: 'name',
        filterable: true,
      },
      {
        Header: 'Rating',
        accessor: 'rating',
        filterable: true,
      },
      {
        Header: 'Time',
        accessor: 'time',
        Cell: props => <span>{props.value.join(' / ')}</span>,
      },
      {
        Header: '',
        accessor: '',
        Cell: function(props) {
          return (
            <span>
              <DeleteMovie id={props.original._id} />
            </span>
          )
        },
      },
      {
        Header: '',
        accessor: '',
        Cell: function(props) {
          return (
            <span>
              <UpdateMovie id={props.original._id} />
            </span>
          )
        },
      },
    ]

    let showTable = true
    if (!product.length) {
      showTable = false
    }

    return (
      <Wrapper>
        {showTable && (
          <ReactTable
            data={product}
            columns={columns}
            loading={isLoading}
            defaultPageSize={10}
            showPageSizeOptions={true}
            minRows={0}
          />
        )}
      </Wrapper>
    )
  }
}

export default ProductList
