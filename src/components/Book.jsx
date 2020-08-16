import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import EntityWithTextComponent from './common/EntityWithTextComponent';

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

const Book = () => {
  const classes = useStyles();
  
  return (
    <div>
      <Link to="/"><Button variant="contained" className={classes.homeButton}>Home</Button></Link>
      <h1 className={classes.title}>Books</h1>
      <EntityWithTextComponent entityType={'book'} />
    </div>
  )
}


export default Book;