import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from "@material-ui/core/styles";
import cx from 'classnames';
import { TileLayer } from 'react-leaflet';

const API_KEY = '694375c71ef84a4c8143116dcd40b2c1';

class TileLayerOffline extends TileLayer {
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
        <Map center={[51.505, -0.09]} zoom={13} className={classes.container}>
          <TileLayer
            url={"https://tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey=" + API_KEY}
            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          />
          <Marker position={[51.505, -0.09]}>
            <Popup>A pretty CSS3 popup.<br />Easily customizable.</Popup>
          </Marker>
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

TileLayerOffline.propTypes = {
};

export default withStyles(styles, { withTheme: true })(TileLayerOffline);