import React from 'react'
import {connect} from 'react-redux'
import TickerForm from './TickerForm'
import PortfolioTable from './PortfolioTable'
import Analysis from './Analysis'

/**
 * COMPONENT
 */
export const Home = props => {
  const {username} = props

  return (
    <div className='root-app-routes-home content'>
      <TickerForm userName={username}/>
      <PortfolioTable />
      <Analysis />
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
