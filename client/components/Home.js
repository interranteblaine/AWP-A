import React from 'react'
import {connect} from 'react-redux'
import TickerForm from './TickerForm'
import PortfolioTable from './PortfolioTable'

/**
 * COMPONENT
 */
export const Home = props => {
  const {username} = props

  return (
    <div>
      <h3>Welcome, {username}</h3>
      <TickerForm />
      <PortfolioTable />
    </div>
  )
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    username: state.auth.username
  }
}

export default connect(mapState)(Home)
