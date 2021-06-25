import React from 'react'
import PropTypes from 'prop-types';
import { TagCloud } from 'react-tagcloud';


const Wordcloud = ({ data }) => {
    return (
        <TagCloud
        minSize={12}
        maxSize={72}
        tags={data}
        onClick={tag => alert(`'${tag.value}' was selected!`)}
      />
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