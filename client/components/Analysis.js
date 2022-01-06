import React from 'react'
import {connect} from 'react-redux'
import * as V from 'victory'
import { fetchDataTable } from '../store/analysis'

class Analysis extends React.Component {
    constructor() {
        super();
    }

    componentDidMount() {
        this.props.loadData(this.props.userId)
    }

    render() {
        return (
            <div>
                <h3>Hello Analysis</h3>
            </div>
        )
    }
}

const mapState = state => {
    return {
        userId: state.auth.id,
        dataTable: state.dataTable
    }
}

const mapDispatch = dispatch => {
    return {
        loadData: (userId) => dispatch(fetchDataTable(userId))
    }
}

export default connect(mapState, mapDispatch)(Analysis);