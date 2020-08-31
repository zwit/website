import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { makeStyles, ThemeProvider } from '@material-ui/core/styles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import { deepOrange, deepPurple } from '@material-ui/core/colors';
import InvertColorsIcon from '@material-ui/icons/InvertColors';
import ContentInner from './ContentInner';

const HOME = '/';

const themeBlack = createMuiTheme({
  name: 'blackTheme',
  backgroundColor: 'black',
  color: 'gray',
  lineColor: 'black',
  mediaCard: {
    actionArea: '1px solid gray',
    selected: 'gray',
    secondaryTextColor: 'gray',
  },
  palette: {
    primary: {
      light: '#808080',
      main: '#808080',
      dark: '#808080',
      contrastText: '#808080',
    }
  }
});

const themeWhite = createMuiTheme({
  name: 'whiteTheme',
  backgroundColor: 'rgb(255, 244, 244)',
  color: 'black',
  lineColor: 'lightblue',
  mediaCard: {
    actionArea: '',
    selected: 'orange',
    secondaryTextColor: 'rgba(0, 0, 0, 0.54)'
  }
});

const useStyles = makeStyles((theme) => ({
  root: {
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
  },
  header: {
    minHeight: 50,
  }
}));

export default function Content(props) {
  const classes = useStyles();
  const { pathname } = useLocation();
  const [selectedTheme, selectTheme] = useState(themeBlack);

  return (
    <ThemeProvider theme={selectedTheme}>
      <ContentInner>
        <div className={classes.root}>
          {props.displayHeader && <div className={classes.header}>
            {pathname !== HOME && (
              <span className={classes.homeButton}>
                <Link to="/">
                  <Button variant="contained">
                    Home
                  </Button>
                </Link>
              </span>
            )}
            <Avatar className={classes.avatar}>J</Avatar>
            <InvertColorsIcon 
              className={classes.themeButton} 
              onClick={() => selectTheme(selectedTheme.name === 'whiteTheme' ? themeBlack : themeWhite)}
            />
          </div>}
          { props.children }
        </div>
      </ContentInner>
    </ThemeProvider>
  );
}