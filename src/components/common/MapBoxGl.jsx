import React from 'react';
import { useState } from 'react';
import ReactMapGL from 'react-map-gl';

const TOKEN = 'pk.eyJ1IjoibnVteSIsImEiOiJja2Vmc2c4eHgwdGJnMnFuN3NnYmUwdWdwIn0.RN4cGa2_56cvYD47hRUctA';

function MapBoxGl() {
  const [viewport, setViewport] = useState({
    width: 400,
    height: 400,
    latitude: 34,
    longitude: 5,
    zoom: 2
  });

  return (
    <ReactMapGL
      mapboxApiAccessToken={TOKEN}
      {...viewport}
      onViewportChange={nextViewport => setViewport(nextViewport)}
    />
  );
}

// class MapBoxGl extends React.Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       lng: 5,
//       lat: 34,
//       zoom: 2,
//       map: null,
//     }
//   }

//   componentDidUpdate(prevProps) {
//     const { features } = this.props;
//     const { map } = this.state;

//     if (map && prevProps.features.length !== features.length) {
//       this.setState({ map : map.getSource('some id').setData({
//       'type': 'geojson',
//       'data': {
//         'type': 'FeatureCollection',
//         'features': features,
//         }
//       })});
//     }
//   }

//   componentDidMount() {
//     const { features } = this.props;

//     console.log('loaded');

//     const map = new mapboxgl.Map({
//       container: this.mapContainer,
//       style: 'mapbox://styles/mapbox/streets-v11',
//       center: [this.state.lng, this.state.lat],
//       zoom: this.state.zoom
//     });

//     map.on('move', () => {
//       this.setState({
//         lng: map.getCenter().lng.toFixed(4),
//         lat: map.getCenter().lat.toFixed(4),
//         zoom: map.getZoom().toFixed(2)
//       });
//     });

//     map.on('load', function() {
//       map.addSource('some id', {
//         type: 'geojson',
//         data: {
//           "type": "FeatureCollection",
//           "features": features
//         }
//       });

//       map.addLayer({
//         'id': 'park-boundary',
//         'type': 'fill',
//         'source': 'some id',
//         'paint': {
//         'fill-color': '#888888',
//         'fill-opacity': 0.4
//         },
//         'filter': ['==', '$type', 'Polygon']
//         });
         
//         map.addLayer({
//         'id': 'park-volcanoes',
//         'type': 'circle',
//         'source': 'some id',
//         'paint': {
//         'circle-radius': 6,
//         'circle-color': '#B42222'
//         },
//         'filter': ['==', '$type', 'Point']
//         });
//     });

//     this.setState({
//       map
//     })
//   }

//   render() {
//     const { classes } = this.props;



//     return (
//       <div>
//         <div className={classes.sideBar}>
//           <div>Longitude: {this.state.lng} | Latitude: {this.state.lat} | Zoom: {this.state.zoom}</div>
//           </div>
//         <div ref={el => this.mapContainer = el} className={classes.mapContainer} />
//       </div>
//     )
//   }
// }

const styles = theme => ({
  sideBar: {
    display: 'inline-block',
    position: 'absolute',
    top: 0,
    left: 0,
    margin: '12px',
    backgroundColor: '#404040',
    color: theme.color,
    zIndex: '1 !important',
    padding: '6px',
    fontWeight: 'bold',
  },
  mapContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
  }
});

MapBoxGl.defaultProps = {
};

MapBoxGl.propTypes = {
};

export default MapBoxGl;