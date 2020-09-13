import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from "@material-ui/core/styles";
import cx from 'classnames';
import MapBoxGl from './MapBoxGl';
import { Map, Marker, Popup, TileLayer, FeatureGroup, Circle } from 'react-leaflet';
import { EditControl } from "react-leaflet-draw";

const API_KEY = '694375c71ef84a4c8143116dcd40b2c1';

class GeoEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    }

    // this.toggleSelected = this.toggleSelected.bind(this);
  }

  render() {
    const {  } = this.state;
    const { classes } = this.props;

    return (
      <div className={classes.container}>
        <Map center={[42.043351, 8.71296]} zoom={9} className={classes.container}>
          <TileLayer
            url={"https://tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey=" + API_KEY}
            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          />
          <Marker position={[51.505, -0.09]}>
            <Popup>A pretty CSS3 popup.<br />Easily customizable.</Popup>
          </Marker>

          <FeatureGroup>
            <EditControl
              position='topright'
              onEdited={this._onEditPath}
              onCreated={this._onCreate}
              onDeleted={this._onDeleted}
              draw={{
                circle: false,
                polyline: false,
                circlemarker: false,
                polygon: false,
                marker: false,
              }}
            />
          </FeatureGroup>
        </Map>
      </div>
    );
  }
}

const styles = theme => ({
  container: {
    // display: 'flex',
    height: '100vh',
    width: '100vw',
    // flex-wrap: nowrap;
  }
});

GeoEditor.propTypes = {
};

export default withStyles(styles, { withTheme: true })(GeoEditor);