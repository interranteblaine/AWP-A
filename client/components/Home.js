import React from 'react'
import {connect} from 'react-redux'
import TickerForm from './TickerForm'
import Portfolio from './Portfolio'

/**
 * COMPONENT
 */
export const Home = props => {
  const {username} = props

  return (
    <div>
      <h3>Welcome, {username}</h3>
      <TickerForm />
      <Portfolio />
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
