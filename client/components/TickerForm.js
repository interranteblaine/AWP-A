import React from 'react'
import {connect} from 'react-redux'
import { fetchSymbols } from '../store/symbols'
import { addToPortfolio } from '../store/portfolio'

class TickerForm extends React.Component {
    constructor() {
        super();
        this.state = {
            symbolId: '',
            weight: '',
            portGroup: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.props.loadSymbols();
    }

    handleChange(e) {
        this.setState({...this.state, [e.target.id]: e.target.value})
    }

    handleSubmit(e) {
        e.preventDefault();
        const { symbolId, weight: weightStr, portGroup } = this.state;
        const { userId } = this.props;
        const weight = Number(weightStr) / 100;
        if (symbolId && weight && portGroup) {
           const portfolioItem = { userId, symbolId, weight, portGroup };
           this.props.addPortfolioItem(portfolioItem);
        }
    }

    render() {
        const { symbols } = this.props;
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <label htmlFor="symbolId">Symbol</label>
                    <select id="symbolId" name="symbolId" onChange={this.handleChange}>
                        <option hidden="hidden">Select a symbol</option>
                        {symbols.map(symbol => (
                            <option 
                                key={symbol.id}
                                value={symbol.id}
                                >
                                {symbol.symbol}
                            </option>
                        ))}
                    </select>
                    <label htmlFor="weight">% Weight</label>
                    <input
                        type="number"
                        id="weight"
                        name="weight"
                        min="0"
                        max="100"
                        onChange={this.handleChange}
                        value={this.state.weight}
                        >
                    </input>
                    <label htmlFor="portGroup">Group</label>
                    <select id="portGroup" name="portGroup" onChange={this.handleChange}>
                        <option hidden="hidden">Select group</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                    </select>
                    <button type="submit">Add to group</button>
                </form>
            </div>
        )
    }
}

const mapState = state => {
    return {
        symbols: state.symbols,
        userId: state.auth.id
    }
}

const mapDispatch = dispatch => {
    return {
        loadSymbols: () => dispatch(fetchSymbols()),
        addPortfolioItem: (portfolioItem) => dispatch(addToPortfolio(portfolioItem))
    }
}

export default connect(mapState, mapDispatch)(TickerForm);