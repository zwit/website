import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

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

const Ml = () => {
  const classes = useStyles();
  
  return (
    <div>
      <Link to="/"><Button variant="contained" className={classes.homeButton}>Home</Button></Link>
      <h1 className={classes.title}>Machine learning</h1>

    </div>
  )
}

export default Ml;