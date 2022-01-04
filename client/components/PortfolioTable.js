import React from 'react'
import {connect} from 'react-redux'
import { fetchPortfolios, removeFromPortfolio } from '../store/portfolio'

class PortfolioTable extends React.Component {
    constructor() {
        super();
        this.growth = this.growth.bind(this);
    }

    componentDidMount() {
        this.props.loadPortfolio(this.props.userId);
    }
    
    totalWeight(portfolioGroup) {
        return portfolioGroup.reduce((acc, item) => acc + item.weight, 0)
    }

    startVal(pricesArr) {
        return pricesArr[0].adjustedClose;
    }

    endVal(pricesArr) {
        return pricesArr[pricesArr.length - 1].adjustedClose;
    }

    growth(pricesArr) {
        const growth = this.endVal(pricesArr)/this.startVal(pricesArr) - 1;
        return (growth * 100);
    }

    formatNum(leadingSymbol, trailingSymbol, num) {
        const strNum = num.toFixed(2).toString();
        const renderNum = strNum.endsWith('.00') ? strNum.slice(0, -3) : strNum;
        if (leadingSymbol) {
            return `${leadingSymbol}${renderNum}`;
        } else {
            return `${renderNum}${trailingSymbol}`;
        }
    }
    
    render() {
        const portfolio = this.props.portfolio;
        const groups = Object.keys(portfolio);
        const { removeItem } = this.props;
        const { startVal, endVal, growth, totalWeight, formatNum } = this;
        return (
            <table>
                <thead>
                    <tr>
                        <th>Symbol</th>
                        <th>% Weight (start)</th>
                        <th>Group</th>
                        <th>Remove</th>
                        <th>Price/Share (start)</th>
                        <th>Price/Share (end)</th>
                        <th>Growth</th>
                        <th>% Weight (end)</th>
                    </tr>
                </thead>
                {groups.map(group => (
                    <tbody key={group}>
                        {portfolio[group].map(item => (
                            <tr key={item.id}>
                                <td>{item.ticker.symbol}</td>
                                <td>{formatNum(null, '%', item.weight * 100)}</td>
                                <td>{item.portGroup}</td>
                                <td>
                                    <button onClick={() => removeItem(item.id)}>Remove</button>
                                </td>
                                <td>{formatNum('$', null, startVal(item.ticker.prices))}</td>
                                <td>{formatNum('$', null, endVal(item.ticker.prices))}</td>
                                <td>{formatNum(null, '%', growth(item.ticker.prices))}</td>
                                <td></td>
                            </tr>
                        ))}
                        <tr>
                            <td>Total:</td>
                            <td>{formatNum(null, '%', totalWeight(portfolio[group]) * 100)}</td>
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
