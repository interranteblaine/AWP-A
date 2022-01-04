import React from 'react'
import {connect} from 'react-redux'
import { fetchPortfolios, removeFromPortfolio } from '../store/portfolio'
import { fetchDates } from '../store/dates'

class PortfolioTable extends React.Component {
    constructor() {
        super();
    }

    componentDidMount() {
        this.props.loadPortfolio(this.props.userId);
        this.props.loadDates();
    }
    
    totalWeight(portfolioGroup) {
        return portfolioGroup.reduce((acc, item) => acc + item.weight, 0)
    }

    valueAtDate(pricesArr, date) {
        if (pricesArr) {
            const { adjustedClose } = pricesArr.find(price => price.datadate.date === date);
            return adjustedClose;
        }
    }
    
    render() {
        const portfolio = this.props.portfolio;
        const groups = Object.keys(portfolio);
        const { removeItem, dates } = this.props;
        const { valueAtDate } = this;
        const startDate = dates[0];
        const endDate = dates[dates.length - 1];
        return (
            <table>
                <thead>
                    <tr>
                        <th>Symbol</th>
                        <th>% Weight (start)</th>
                        <th>Group</th>
                        <th>Remove</th>
                        <th>Start Value</th>
                        <th>End Value</th>
                        <th>Growth</th>
                        <th>% Weight (end)</th>
                    </tr>
                </thead>
                {groups.map(group => (
                    <tbody key={group}>
                        {portfolio[group].map(item => (
                            <tr key={item.id}>
                                <td>{item.ticker.symbol}</td>
                                <td>{item.weight * 100 + '%'}</td>
                                <td>{item.portGroup}</td>
                                <td>
                                    <button onClick={() => removeItem(item.id)}>Remove</button>
                                </td>
                                <td>{valueAtDate(item.ticker.prices, startDate)}</td>
                                <td>{valueAtDate(item.ticker.prices, endDate)}</td>
                                <td></td>
                                <td></td>
                            </tr>
                        ))}
                        <tr>
                            <td>Total:</td>
                            <td>{this.totalWeight(portfolio[group]) * 100 + '%'}</td>
                        </tr>
                    </tbody>
                ))}
            </table>
        )
    }
}

const mapState = state => {
    return {
        portfolio: state.portfolio,
        userId: state.auth.id,
        dates: state.dates
    }
}

const mapDispatch = dispatch => {
    return {
        loadPortfolio: (userId) => dispatch(fetchPortfolios(userId)),
        removeItem: (itemId) => dispatch(removeFromPortfolio(itemId)),
        loadDates: () => dispatch(fetchDates())
    }
}

export default connect(mapState, mapDispatch)(PortfolioTable);
