import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Content from './common/Content';

const useStyles = makeStyles((theme) => ({
  title: {
    textAlign: 'center',
  }
}));

const Ml = () => {
  const classes = useStyles();
  
  return (
    <div>
      <Content>
        <h1 className={classes.title}>Machine learning</h1>
      </Content>
    </div>
  )
}

export default Ml;