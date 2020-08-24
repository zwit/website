import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TimeLineComponent from './common/TimeLineComponent';
import Content from './common/Content';

const useStyles = makeStyles((theme) => ({
  title: {
    textAlign: 'center',
  }
}));

const Science = () => {
  const classes = useStyles();

  return (
    <div>
      <Content>
        <h1 className={classes.title}>Science</h1>
        <TimeLineComponent 
          type={'science'}
          displaySlider={false}
        />
      </Content>
    </div>
  )
}

export default Science;