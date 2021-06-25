import React from 'react'
import PropTypes from 'prop-types';
import randomColor from "randomcolor";
import shuffle from 'lodash/shuffle';

const Wordcloud = ({ data }) => {
    const shuffledData = shuffle(data)
    const maxCount = data[0].count
    const scale = 100/maxCount
    return (
        <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center'}}>
        {
            shuffledData.map((obj, index) => 
                <span key={index} style={{color: randomColor(), fontSize: scale * obj.count}}>{obj.value}</span>
                )
        }
        </div>
    )
}
Wordcloud.defaultProps = {
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
Wordcloud.propTypes = {
    data: PropTypes.array.isRequired
}
export default Wordcloud;