import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import { deepOrange, deepPurple } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
  homeButton: {
    '& a': {
      textDecoration: 'none',
    }
  },
  avatar: {
    float: 'right',
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500],
  },
}));

export default function Header({}) {
  const classes = useStyles();

  return (
    <div>
      <span className={classes.homeButton}><Link to="/"><Button variant="contained">Home</Button></Link></span>
      <Avatar className={classes.avatar}>J</Avatar>
    </div>
  );
}