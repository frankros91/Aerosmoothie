import React from 'react'
import PropTypes from 'prop-types';
import randomColor from "randomcolor";
import { Chart } from "react-google-charts";

const GenrePieChart = ({ data }) => {
    const formattedData = data.map((obj) => ([obj.value, obj.count]));
    const dataWithHeader = [['test', 'header']].concat(formattedData)
    console.log(dataWithHeader)
    return (
        <Chart
            width={'500px'}
            height={'300px'}
            chartType="PieChart"
            loader={<div>Loading Chart</div>}
            data={dataWithHeader}
            options={{
                title: 'Songs by Genre',
            }}
            rootProps={{ 'data-testid': '1' }}
        />
    )
}
GenrePieChart.defaultProps = {
    data: [
        { value: 'JavaScript', count: 38 },
        { value: 'React', count: 30 },
        { value: 'Nodejs', count: 28 },
        { value: 'Express.js', count: 25 },
        { value: 'HTML5', count: 33 },
        { value: 'MongoDB', count: 18 },
        { value: 'CSS3', count: 20 },
    ]
}
GenrePieChart.propTypes = {
    data: PropTypes.array.isRequired
}
export default GenrePieChart;