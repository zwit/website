import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import EntityWithTextComponent from './common/EntityWithTextComponent';
import Content from './common/Content';

const useStyles = makeStyles((theme) => ({
  title: {
    textAlign: 'center',
  }
}));

const Book = () => {
  const classes = useStyles();
  
  return (
    <div>
      <Content>
        <h1 className={classes.title}>Books</h1>
        <EntityWithTextComponent entityType={'book'} />
      </Content>
    </div>
  )
}


export default Book;