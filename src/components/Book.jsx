import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import EntityWithTextComponent from './common/EntityWithTextComponent';
import Header from './common/Header';

const useStyles = makeStyles((theme) => ({
  title: {
    textAlign: 'center',
  }
}));

const Book = () => {
  const classes = useStyles();
  
  return (
    <div>
      <Header/>
      <h1 className={classes.title}>Books</h1>
      <EntityWithTextComponent entityType={'book'} />
    </div>
  )
}


export default Book;