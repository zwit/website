import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { makeStyles, ThemeProvider } from '@material-ui/core/styles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import { deepOrange, deepPurple } from '@material-ui/core/colors';
import InvertColorsIcon from '@material-ui/icons/InvertColors';
import ContentInner from './ContentInner';
import cx from 'classnames';

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
    overflow: 'scroll',
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
  },
  headerAbsolute: {
    position: 'absolute',
    zIndex: 100,
    width: '100%',
    opacity: 0.7,
    paddingTop: 20,
  },
  marginLeft: {
    marginLeft: 20,
  },
  marginRight: {
    marginRight: 20,
  },
}));

export default function Content({ children, absolute = false }) {
  const classes = useStyles();
  const { pathname } = useLocation();
  const [selectedTheme, selectTheme] = useState(themeBlack);

  return (
    <ThemeProvider theme={selectedTheme}>
      <ContentInner absolute={absolute}>
        <div className={classes.root}>
          <div className={cx(absolute ? classes.headerAbsolute : classes.header)}>
            <span className={cx(absolute ? classes.padding : null)}></span>
            {pathname !== HOME && (
              <span className={cx(absolute ? classes.marginLeft : null, classes.homeButton)}>
                <Link to="/">
                  <Button variant="contained">
                    Home
                  </Button>
                </Link>
              </span>
            )}
            <Avatar className={cx(absolute ? classes.marginRight : null, classes.avatar)}>J</Avatar>
            <InvertColorsIcon 
              className={classes.themeButton} 
              onClick={() => selectTheme(selectedTheme.name === 'whiteTheme' ? themeBlack : themeWhite)}
            />
          </div>
          { children }
        </div>
      </ContentInner>
    </ThemeProvider>
  );
}