import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TimeLineComponent from './common/TimeLineComponent';
import Header from './common/Header';

const useStyles = makeStyles((theme) => ({
  title: {
    textAlign: 'center',
  }
}));

const Science = () => {
  const classes = useStyles();

  return (
    <div>
      <Header/>
      <h1 className={classes.title}>Science</h1>
      <TimeLineComponent 
        type={'science'}
        displaySlider={false}
      />
    </div>
  )
}

export default Science;