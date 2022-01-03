import React from 'react'
import {connect} from 'react-redux'
import { fetchPortfolios, removeFromPortfolio } from '../store/portfolio'

class Portfolio extends React.Component {
    constructor() {
        super()
    }

    componentDidMount() {
        this.props.loadPortfolio(this.props.userId);
    }
    
    render() {
        const portA = this.props.portfolio["A"] || [];
        const portB = this.props.portfolio["B"] || [];
        const { removeItem } = this.props;
        return (
            <table>
                <thead>
                    <tr>
                        <th>Symbol</th>
                        <th>% Weight</th>
                        <th>Group</th>
                        <th>Remove</th>
                    </tr>
                </thead>
                <tbody>
                    {portA.map(item => (
                        <tr key={item.id}>
                            <td>{item.ticker.symbol}</td>
                            <td>{item.weight}</td>
                            <td>{item.portGroup}</td>
                            <td>
                                <button onClick={() => removeItem(item.id)}>Remove</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
                <tbody>
                    {portB.map(item => (
                        <tr key={item.id}>
                            <td>{item.ticker.symbol}</td>
                            <td>{item.weight}</td>
                            <td>{item.portGroup}</td>
                            <td>
                                <button onClick={() => removeItem(item.id)}>Remove</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )
    }
}

const mapState = state => {
    return {
        portfolio: state.portfolio,
        userId: state.auth.id
    }
}

const mapDispatch = dispatch => {
    return {
        loadPortfolio: (userId) => dispatch(fetchPortfolios(userId)),
        removeItem: (itemId) => dispatch(removeFromPortfolio(itemId))
    }
}

export default connect(mapState, mapDispatch)(Portfolio);
