import React from 'react'
import {connect} from 'react-redux'
import { fetchPortfolios, removeFromPortfolio } from '../store/portfolio'

class PortfolioTable extends React.Component {
    constructor() {
        super()
    }

    componentDidMount() {
        this.props.loadPortfolio(this.props.userId);
    }

    totalWeight(portfolioGroup) {
        return portfolioGroup.reduce((acc, item) => acc + item.weight, 0)
    }
    
    render() {
        const portfolioGroups = Object.keys(this.props.portfolio);
        
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
                            <td>{item.weight * 100 + '%'}</td>
                            <td>{item.portGroup}</td>
                            <td>
                                <button onClick={() => removeItem(item.id)}>Remove</button>
                            </td>
                        </tr>
                    ))}
                    <tr>
                        <td>Total:</td>
                        <td>{this.totalWeight(portA) * 100 + '%'}</td>
                    </tr>
                </tbody>
                <tbody>
                    {portB.map(item => (
                        <tr key={item.id}>
                            <td>{item.ticker.symbol}</td>
                            <td>{item.weight * 100 + '%'}</td>
                            <td>{item.portGroup}</td>
                            <td>
                                <button onClick={() => removeItem(item.id)}>Remove</button>
                            </td>
                        </tr>
                    ))}
                    <tr>
                        <td>Total:</td>
                        <td>{this.totalWeight(portB) * 100 + '%'}</td>
                    </tr>
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

export default connect(mapState, mapDispatch)(PortfolioTable);
