import React from 'react'
import {connect} from 'react-redux'
import { VictoryChart, VictoryLine, VictoryTheme, VictoryAxis } from 'victory'
import { fetchDataTable, resetChartData } from '../store/analysis'

class Analysis extends React.Component {
    constructor() {
        super();
    }

    componentDidMount() {
        this.props.loadData(this.props.userId)
    }

    componentDidUpdate(prevProps) {
        const { userId, loadData, portfolio: currPort } = this.props;
        const prevPort = prevProps.portfolio;
        const currGroups = Object.keys(currPort);
        if (userId !== prevProps.userId) loadData(userId);
        currGroups.forEach(cG => {
            if (currPort[cG].length !== prevPort[cG].length) loadData(userId);
        })
    }

    componentWillUnmount() {
        this.props.resetChart()
    }
    
    getStrokeColor(idx) {
        const colors = ['red', 'blue', 'green'];
        return colors[idx];
    }

    render() {
        const { portfolio, dataTable } = this.props;
        const groups = Object.keys(portfolio);
        const { getStrokeColor } = this;
        return (
            <div>
                <h4>Portfolio Value (assumes $6k invested)</h4>
                <VictoryChart
                    theme={VictoryTheme.material}
                    width={550}
                    height={300}
                    padding={{ top: 10, bottom: 50, left: 50, right: 50 }}
                    >
                    {
                        groups.map((g, i) => (
                            <VictoryLine
                            key={g}
                            style={{
                                data: { stroke: getStrokeColor(i) },
                                parent: { border: "1px solid #ccc"}
                            }}
                            data={dataTable.filter(d => d.group === g)}
                            x="date"
                            y="totalValue"
                        />
                        ))
                    }
                    <VictoryAxis
                        dependentAxis
                        tickFormat={(d) => (`$${d / 1000}k`)}
                    />
                    <VictoryAxis
                        crossAxis
                        tickFormat={(d) => (`${d.toString().slice(0, -3)}`)}
                        fixLabelOverlap={true}
                    />
                </VictoryChart>
            </div>
        )
    }
}

const mapState = state => {
    return {
        userId: state.auth.id,
        dataTable: state.dataTable,
        portfolio: state.portfolio
    }
}

const mapDispatch = dispatch => {
    return {
        loadData: (userId) => dispatch(fetchDataTable(userId)),
        resetChart: () => dispatch(resetChartData())
    }
}

export default connect(mapState, mapDispatch)(Analysis);