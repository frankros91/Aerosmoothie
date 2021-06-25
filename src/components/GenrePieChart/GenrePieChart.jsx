import React from 'react'
import PropTypes from 'prop-types';
import randomColor from "randomcolor";
import { PieChart } from 'react-minimal-pie-chart';

const Wordcloud = ({ data }) => {
    console.log('genrecount is')
    console.log(data)
    const formattedData = data.map((obj, index) => ({title: Object.keys(obj)[0], value: Object.values(obj)[0], color: randomColor()}));
    console.log(formattedData)
    return (
        <PieChart data={formattedData}></PieChart>

    )
}
Wordcloud.defaultProps = {
    data: [
        {'JavaScript': 38 },
        { 'React': 30 },
        { 'Nodejs': 28 },
        { 'Express.js': 25 },
        { 'HTML5': 33 },
        { 'MongoDB': 18 },
        { 'CSS3': 20 },
    ]
}
Wordcloud.propTypes = {
    data: PropTypes.array.isRequired
}
export default Wordcloud;