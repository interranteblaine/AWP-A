import React from 'react'
import {connect} from 'react-redux'
import { VictoryChart, VictoryLine, VictoryTheme, VictoryAxis, VictoryLegend, VictoryVoronoiContainer, VictoryTooltip } from 'victory'
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
            <div className='root-app-routes-home-analysis chart'>
                <h3>Portfolio Value (assumes $6k invested)</h3>
                <VictoryChart
                    theme={VictoryTheme.material}
                    width={550}
                    height={250}
                    padding={{ top: 5, bottom: 50, left: 50, right: 50 }}
                    containerComponent={
                        <VictoryVoronoiContainer 
                        voronoiDimension='x'
                        labels={({ datum }) => `$${(datum.totalValue / 1000).toFixed(2)}k` }
                        labelComponent={
                            <VictoryTooltip 
                                constrainToVisibleArea
                                cornerRadius={0}
                                flyoutStyle={{ fill: 'white', stroke: 'gainsboro'}}
                            />
                        }
                        />
                    }
                    >
                    <VictoryLegend
                        x={60}
                        y={5}
                        orientation='horizontal'
                        gutter={20}
                        style={{ border: { stroke: "black" }, title: {fontSize: 20 } }}
                        data={groups.map((g, i) => ({name: g, symbol: { fill: getStrokeColor(i), type: "minus"}}))}
                    />
                    {
                        groups.map((g, i) => (
                            <VictoryLine
                            key={g}
                            style={{
                                data: { stroke: getStrokeColor(i) },
                                parent: { border: "1px solid #ccc"},
                                labels: { fill: getStrokeColor(i) }
                            }}
                            data={dataTable.filter(d => d.group === g)}
                            x="date"
                            y="totalValue"
                            animate={{
                                onExit: {
                                  duration: 500,
                                  before: () => ({ _y: 0 })
                                }}}
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