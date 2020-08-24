import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { makeStyles, ThemeProvider } from '@material-ui/core/styles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import { deepOrange, deepPurple } from '@material-ui/core/colors';
import InvertColorsIcon from '@material-ui/icons/InvertColors';
import ContentInner from './ContentInner';

const themeBlack = createMuiTheme({
  name: 'blackTheme',
  backgroundColor: 'black',
  color: 'white',
  mediaCard: {
    actionArea: '1px solid white',
    selected: 'white',
    secondaryTextColor: 'white'
  }
});

const themeWhite = createMuiTheme({
  name: 'whiteTheme',
  backgroundColor: 'rgb(255, 244, 244)',
  color: 'black',
  mediaCard: {
    actionArea: '',
    selected: 'orange',
    secondaryTextColor: 'rgba(0, 0, 0, 0.54)'
  }
});

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 20,
    minHeight: '100vh',
    height: '100%',
    
  },
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
  themeButton: {
    float: 'right',
    marginTop: 5,
    marginRight: 10,
    fontSize: 30,
    cursor: 'pointer',
  }
}));

export default function Content(props) {
  const classes = useStyles();
  const [selectedTheme, selectTheme] = useState(themeBlack);

  return (
    <ThemeProvider theme={selectedTheme}>
      <ContentInner>
        <div className={classes.root}>
          <div>
            <span className={classes.homeButton}><Link to="/"><Button variant="contained">Home</Button></Link></span>
            <Avatar className={classes.avatar}>J</Avatar>
            <InvertColorsIcon 
              className={classes.themeButton} 
              onClick={() => selectTheme(selectedTheme.name === 'whiteTheme' ? themeBlack : themeWhite)}
            />
          </div>
          { props.children }
        </div>
      </ContentInner>
    </ThemeProvider>
  );
}