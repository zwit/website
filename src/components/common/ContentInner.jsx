import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import cx from 'classnames';

const useStyles = makeStyles((theme, absolute) => ({
  root: {
    color: theme.color,
    backgroundColor: theme.backgroundColor,
    height: '100%',
  },
  padding: {
    padding: 20,
  }
}));

export default function Content({ children, absolute }) {
  const classes = useStyles();

  return (
    <div className={cx(classes.root, absolute ? null : classes.padding)}>
      { children }
    </div>
  );
}