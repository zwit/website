import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TimeLineComponent from './common/TimeLineComponent';
import Header from './common/Header';

const useStyles = makeStyles((theme) => ({
  title: {
    textAlign: 'center',
  }
}));

const Art = () => {
  const classes = useStyles();
  
  return (
    <div>
      <Header/>
      <h1 className={classes.title}>Art</h1>
      <TimeLineComponent 
        type={'art'}
        displaySlider={false}
      />
    </div>
  )
}

export default Art;