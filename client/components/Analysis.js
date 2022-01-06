import React from 'react'
import {connect} from 'react-redux'
import { VictoryChart, VictoryLine, VictoryTheme, VictoryAxis } from 'victory'
import { fetchDataTable } from '../store/analysis'

class Analysis extends React.Component {
    constructor() {
        super();
    }

    componentDidMount() {
        this.props.loadData(this.props.userId)
    }

    componentDidUpdate(prevProps) {
        const prevPort = prevProps.portfolio;
        const currPort = this.props.portfolio;
        const currGroups = Object.keys(currPort);
        currGroups.forEach(cG => {
            if (currPort[cG].length !== prevPort[cG].length) {
                this.props.loadData(this.props.userId)
            }
        })
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
                <VictoryChart
                    theme={VictoryTheme.material}
                    width={550}
                    height={300}
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
        loadData: (userId) => dispatch(fetchDataTable(userId))
    }
}

export default connect(mapState, mapDispatch)(Analysis);