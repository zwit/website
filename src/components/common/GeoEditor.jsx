import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from "@material-ui/core/styles";
import cx from 'classnames';
import MapBoxGl from './MapBoxGl';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';

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
        <Map center={[51.505, -0.09]} zoom={13}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          />
          <Marker position={[51.505, -0.09]}>
            <Popup>A pretty CSS3 popup.<br />Easily customizable.</Popup>
          </Marker>
        </Map>

        {/* <MapBoxGl
          containerStyle={{
            height: '100vh',
            flex: 1,
          }}
          zoom={[2]}
        />
        <div>
          test
        </div> */}
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