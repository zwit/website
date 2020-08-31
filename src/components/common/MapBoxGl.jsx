import React from 'react';
import { useState } from 'react';
import ReactMapboxGl, { Layer, Feature, GeoJSONLayer, Source } from 'react-mapbox-gl';
import mapboxgl from 'mapbox-gl';
import { withStyles } from "@material-ui/core/styles";
import {
  romanEmpire117CE,
} from '../../utils/romanEmpire';

const TOKEN = 'pk.eyJ1IjoibnVteSIsImEiOiJja2Vmc2c4eHgwdGJnMnFuN3NnYmUwdWdwIn0.RN4cGa2_56cvYD47hRUctA';

const Map = ReactMapboxGl({
  accessToken: TOKEN
});

function MapBoxGl({containerStyle, zoom}) {
  const [viewport, setViewport] = useState({
    width: 400,
    height: 400,
    latitude: 34,
    longitude: 5,
    zoom: 2
  });

  return (
    <Map
      style="mapbox://styles/mapbox/streets-v9"
      containerStyle={containerStyle}
      center={[20, 34]}
      zoom={zoom}
    >
      <GeoJSONLayer
        fillLayout={{ visibility: 'visible' }}
        fillPaint={{
          'fill-color': 'white',
        }}
        data={romanEmpire117CE}
      />
    </Map>
  );
}

export default MapBoxGl;