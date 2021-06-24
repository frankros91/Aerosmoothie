import React from 'react'
import PropTypes from 'prop-types';
import RadarChart from 'react-svg-radar-chart';
import 'react-svg-radar-chart/build/css/index.css'


const Radar = ({ data, captions }) => {
    return (
        <RadarChart
    captions={captions}
    data={data}
    size={450}
  />
    )
}
Radar.defaultProps = {
    data: [
        {
          data: {
            battery: 0.7,
            design: .8,
            useful: 0.9,
            speed: 0.67,
            weight: 0.8
          },
          meta: { color: 'blue' }
        },
        {
          data: {
            battery: 0.6,
            design: .85,
            useful: 0.5,
            speed: 0.6,
            weight: 0.7
          },
          meta: { color: 'red' }
        }
      ],
    captions: {
        // columns
        battery: 'Battery Capacity',
        design: 'Design',
        useful: 'Usefulness',
        speed: 'Speed',
        weight: 'Weight'
      }
}
Radar.propTypes = {
    data: PropTypes.array.isRequired,
    captions: PropTypes.array.isRequired
}
export default Radar;