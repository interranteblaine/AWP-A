import React from 'react'
import {connect} from 'react-redux'
import { fetchSymbols } from '../store/symbols'

class PortfolioForm extends React.Component {
    constructor() {
        super();
        this.state = {
            symbolId: '',
            weight: ''
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
        console.log(this.state)
    }

    render() {
        const { symbols } = this.props;
        return (
            <div>
                <h3>Portfolio Construction</h3>
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
                </form>
            </div>
        )
    }
}

const mapState = state => {
    return {
        symbols: state.symbols
    }
}

const mapDispatch = dispatch => {
    return {
        loadSymbols: () => dispatch(fetchSymbols())
    }
}

export default connect(mapState, mapDispatch)(PortfolioForm);