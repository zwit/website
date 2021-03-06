import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { ResponsiveChoropleth } from '@nivo/geo';
import { linearGradientDef } from '@nivo/core';

const geoWorld = require('../../utils/geo/geo.json');
const unknownColor = "#666666";

const useStyles = makeStyles(theme => ({
  map: {
    height: '100vh',

    '& path:not([fill="#666666"])': {
      cursor: 'pointer',
      opacity: 0.6,
      
      '&:hover': {
        opacity: 1,
      },
    },

    '& path[fill="#666666"]': {
      cursor: 'pointer',
      opacity: 0.8,
    }
  }
}));

const GeoWorld = ({ data, features, onClick }) => {
  const classes = useStyles();

  return (
    <div className={classes.map} onDrag={() => {console.log('test')}}>
      <ResponsiveChoropleth
        data={data}
        features={geoWorld.features.concat(features)}
        onClick={onClick}
        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        colors="nivo"
        domain={[ 0, 1000000 ]}
        unknownColor={unknownColor}
        label="properties.name"
        valueFormat={() => {}}
        projectionScale={240}
        projectionTranslation={[ 0.48, 0.6 ]}
        projectionRotation={[ 0, 0, 0 ]}
        enableGraticule={true}
        graticuleLineColor="#dddddd"
        borderWidth={0.5}
        borderColor="#152538"
        // defs={[
        //   {
        //     id: "current",
        //     type: "linearGradient",
        //     colors: [
        //       { offset: 0, color: "#faf047" },
        //       { offset: 100, color: "#e4b400" }
        //     ]
        //   }
        // ]}
        // fill={[{ match: '*', id: "current" }]}
        // legends={[
        //   {
        //     anchor: 'bottom-left',
        //     direction: 'column',
        //     justify: true,
        //     translateX: 20,
        //     translateY: -130,
        //     itemsSpacing: 0,
        //     itemWidth: 94,
        //     itemHeight: 18,
        //     itemDirection: 'left-to-right',
        //     itemTextColor: '#444444',
        //     itemOpacity: 0.85,
        //     symbolSize: 18,
        //     effects: [
        //       {
        //         on: 'hover',
        //         style: {
        //           itemTextColor: '#000000',
        //           itemOpacity: 1
        //         }
        //       }
        //     ]
        //   }
        // ]}
      />
    </div>
  );
}

export default GeoWorld;