import React, { useState, useEffect } from 'react';
import { Map, List } from 'immutable';
import MediaCard from './common/MediaCard';
import { makeStyles } from '@material-ui/core/styles';
import { deepOrange } from '@material-ui/core/colors';
import { Link } from 'react-router-dom';
import matrix from '../images/matrix.png';
import tintin from '../images/tintin.png';
import eratosthene from '../images/eratosthene.png';
import interstellarBooks from '../images/interstellar-books.png';
import yellowSubmarine from '../images/yellow-submarine.png';
import oss117 from '../images/oss117.png';
import castle from '../images/castle.jpg';
import ai from '../images/ai.png';
import stats from '../images/stats.png';
import geojson from '../images/geojson.png';
import Content from './common/Content';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  header: {
    height: 50,
  },
  avatar: {
    float: 'right',
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500],
  },
}));

const Home = () => {
  const classes = useStyles();
  const [sideProjectList, setSideProjectList] = useState(List([Map({
    url: '/stats',
    title: 'Stats',
    image: stats,
    description: 'Stats charts',
    position: 1,
  }), Map({
    url: '/ml',
    title: 'ML projects',
    image: ai,
    description: 'ML test',
    position: 2,
  }), Map({
    url: '/geoedit',
    title: 'GeoJSON Editor',
    image: geojson,
    description: '',
    position: 3,
  }), Map({
    url: '/culture',
    title: 'Uplift',
    image: castle,
    description: '',
    position: 4,
  }), Map({
    url: '/crypto',
    title: 'Crypto',
    image: matrix,
    description: 'Crypto desc',
    position: 5,
  })]));

  const config =  {
    spotify: {
      client_id: 'YOUR_CLIENT_ID',
      client_secret: 'YOUR_CLIENT_SECRET'
    }
  }

  useEffect(() => {
    // fetch('/api/activity')
    //   .then(res => res.json())
    //   .then(sideProjectList => {
    //     // setSideProjectList(List(sideProjectList.map(activity => Map(activity))));
    //   });
    fetch('http://zwit.xyz:9200/_cat/health?v')
      .then(res => res.json())
      .then(sideProjectList => {
        // setSideProjectList(List(sideProjectList.map(activity => Map(activity))));
      });
  })

  return (
    <Content>
      {sideProjectList
        .sort((a, b) => a.get('position') - b.get('position'))
        .map((sideProject) => (
          <Link to={sideProject.get('url')}>
            <MediaCard category={sideProject} />
          </Link>
        ))
      }
    </Content>
  );
}

export default Home;