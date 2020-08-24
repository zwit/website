import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    color: theme.color,
    backgroundColor: theme.backgroundColor,
    height: '100%',
  },
}));

export default function Content(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      { props.children }
    </div>
  );
}