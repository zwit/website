import React, { useState, useEffect } from 'react';
import { Map, List } from 'immutable';
import MediaCard from './common/MediaCard';
import { makeStyles } from '@material-ui/core/styles';
import { deepOrange } from '@material-ui/core/colors';
import { Link } from 'react-router-dom';
import age from '../images/age.jpeg';
import tintin from '../images/tintin.png';
import eratosthene from '../images/eratosthene.png';
import interstellarBooks from '../images/interstellar-books.png';
import yellowSubmarine from '../images/yellow-submarine.png';
import oss117 from '../images/oss117.png';
import ai from '../images/ai.png';
import stats from '../images/stats.png';
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

const Culture = () => {
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
    url: '/geopol',
    title: 'Geopolitics',
    image: age,
    description: '',
    position: 9,
  })]));

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

export default Culture;