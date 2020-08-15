import React, { useState, useEffect } from 'react';
import { Map, List } from 'immutable';
import SimpleCard from '../common/SimpleCard';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import { deepOrange, deepPurple } from '@material-ui/core/colors';
import { Link } from 'react-router-dom';
import matrix from '../../images/matrix.png';
import tintin from '../../images/tintin.png';
import eratosthene from '../../images/eratosthene.png';
import interstellarBooks from '../../images/interstellar-books.png';
import yellowSubmarine from '../../images/yellow-submarine.png';
import oss117 from '../../images/oss117.png';
import ai from '../../images/ai.png';
import stats from '../../images/stats.png';

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
    url: '/history',
    title: 'History',
    image: oss117,
    description: 'History timeline',
    position: 1,
  }), Map({
    url: '/lang',
    title: 'Lang',
    image: tintin,
    description: 'Lang learning',
    position: 4,
  }), Map({
    url: '/science',
    title: 'Science',
    image: eratosthene,
    description: 'Science timeline',
    position: 3,
  }), Map({
    url: '/art',
    title: 'Art',
    image: yellowSubmarine,
    description: 'Art timeline',
    position: 2,
  }), Map({
    url: '/book',
    title: 'Book',
    image: interstellarBooks,
    description: 'Booknotes',
    position: 5,
  }), Map({
    url: '/stats',
    title: 'Stats',
    image: stats,
    description: 'Stats charts',
    position: 6,
  }), Map({
    url: '/ai',
    title: 'ML projects',
    image: ai,
    description: 'ML test',
    position: 7,
  }), Map({
    url: '/crypto',
    title: 'Crypto',
    image: matrix,
    description: 'Crypto desc',
    position: 8,
  })]));

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
    <div className={classes.root}>
      <div className={classes.header}><Avatar className={classes.avatar}>J</Avatar></div>
      {sideProjectList
        .sort((a, b) => a.get('position') - b.get('position'))
        .map((sideProject) => (
          <Link to={sideProject.get('url')}>
            <SimpleCard category={sideProject} />
          </Link>
        ))
      }
    </div>
  );
}

export default Home;