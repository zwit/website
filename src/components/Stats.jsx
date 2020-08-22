import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveChoropleth } from '@nivo/geo'
import { franceFeature } from '../utils/geoFeatures';
import { List, Map } from 'immutable';
import { withStyles } from "@material-ui/core/styles";
import { ResponsiveLine } from '@nivo/line';
import moment from 'moment';
import { TextField, Checkbox, Switch, FormControlLabel, CircularProgress, Button } from '@material-ui/core';
import Slider from './common/Slider';
import Header from './common/Header';
import backgroundMedieval from '../images/background-medieval.png';
import Wikipedia from '../images/wikipedia.png';
import Spotify from '../images/spotify.png';
import OMDBAPI from '../images/OMDB-API.png';
import apiGouvFr from '../images/apigouvfr.png';
import APIgouvFr from './api/APIgouvFr';
import APIwiki from './api/APIwiki';
import APIspotify from './api/APIspotify';
import APIomdb from './api/APIomdb';

const styles = theme => ({
  title: {
    textAlign: 'center',
  },
  statsDisplay: {
    height: 600,
  }
});

class Stats extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedAPI: null,
    };

    this.selectAPI = this.selectAPI.bind(this);
  }

  selectAPI(selectedAPI) {
    this.setState({ 
      selectedAPI
    });
  }

  render() {
    const { selectedAPI } = this.state;
    const { classes } = this.props;

    return (
      <div>
        <Header/>
        <h1 className={classes.title}>Stats</h1>

        <Slider
          entityList={List([
            Map({id: 1, title: 'api.gouv.fr', description: '', image: apiGouvFr}),
            Map({id: 3, title: 'wiki API', description: '', image: Wikipedia}),
            Map({id: 4, title: 'spotify API', description: '', image: Spotify}),
            Map({id: 5, title: 'OMDb API', description: '', image: OMDBAPI}),
            Map({id: 2, title: 'sport API', description: '', image: backgroundMedieval}),
            Map({id: 6, title: 'twitter API', description: '', image: backgroundMedieval}),
            Map({id: 7, title: 'google API', description: '', image: backgroundMedieval}),
            Map({id: 8, title: 'facebook API', description: '', image: backgroundMedieval}),
            Map({id: 9, title: 'github API', description: '', image: backgroundMedieval}),
            Map({id: 10, title: 'slack API', description: '', image: backgroundMedieval}),
          ])}
          selectEntity={this.selectAPI}
          displayEdition={false}
          deleteEntity={() => {}}
          postEntity={() => {}}
          selectedEntity={selectedAPI}
        />

        {selectedAPI && selectedAPI.get('id') === 1 && <APIgouvFr/>}
        {selectedAPI && selectedAPI.get('id') === 3 && <APIwiki/>}
        {selectedAPI && selectedAPI.get('id') === 5 && <APIomdb/>}
        {selectedAPI && selectedAPI.get('id') === 4 && <APIspotify/>}
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Stats);