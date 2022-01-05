import React from 'react'
import {connect} from 'react-redux'
import { fetchPortfolios, removeFromPortfolio } from '../store/portfolio'

class PortfolioTable extends React.Component {
    constructor() {
        super();
    }

    componentDidMount() {
        this.props.loadPortfolio(this.props.userId);
    }
    
    totalWeightCalc(portfolioGroup) {
        return portfolioGroup.reduce((acc, item) => acc + item.weight, 0)
    }

    getStartPrice(pricesArr) {
        return pricesArr[0].adjustedClose;
    }

    getEndPrice(pricesArr) {
        return pricesArr[pricesArr.length - 1].adjustedClose;
    }

    growthCalc(startVal, endVal) {
        return endVal/startVal - 1;
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
        const { removeItem, portfolio } = this.props;
        const groups = Object.keys(portfolio);
        const { getStartPrice, getEndPrice, growthCalc, totalWeightCalc, formatNum } = this;
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
                    </tr>
                </thead>
                {groups.map(group => {
                    let startBalance = 1;
                    let endBalance = 0;
                    return (
                    <tbody key={group}>
                        {portfolio[group].map(item => {
                            let startPrice = getStartPrice(item.ticker.prices);
                            let endPrice = getEndPrice(item.ticker.prices);
                            let growth = growthCalc(startPrice, endPrice);
                            let itemEndValue = (item.weight / startPrice) * endPrice;
                            endBalance += itemEndValue;
                            return (
                            <tr key={item.id}>
                                <td>{item.ticker.symbol}</td>
                                <td>{formatNum(null, '%', item.weight * 100)}</td>
                                <td>{item.portGroup}</td>
                                <td>
                                    <button onClick={() => removeItem(item.id)}>Remove</button>
                                </td>
                                <td>{formatNum('$', null, startPrice)}</td>
                                <td>{formatNum('$', null, endPrice)}</td>
                                <td>{formatNum(null, '%', growth * 100)}</td>
                            </tr>
                            )
                        })}
                        <tr>
                            <td>Total:</td>
                            <td>{formatNum(null, '%', totalWeightCalc(portfolio[group]) * 100)}</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>Balance Growth:</td>
                            <td>{formatNum(null, '%', ((endBalance / startBalance) - 1) * 100)}</td>
                        </tr>
                    </tbody>
                    )
                })}
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
