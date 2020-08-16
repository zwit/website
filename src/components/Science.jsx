import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import TimeLineComponent from './common/TimeLineComponent';

const useStyles = makeStyles((theme) => ({
  homeButton: {
    a: {
      textDecoration: 'none',
    },
  },
  title: {
    textAlign: 'center',
  }
}));

const Science = () => {
  const classes = useStyles();

  return (
    <div>
      <Link to="/"><Button variant="contained" className={classes.homeButton}>Home</Button></Link>
      <h1 className={classes.title}>Science</h1>
      <TimeLineComponent 
        type={'science'}
        displaySlider={false}
      />
    </div>
  )
}

export default Science;