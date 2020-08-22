import React, { useEffect, useState } from 'react';
import { List, Map } from 'immutable';
import { withStyles } from "@material-ui/core/styles";
import { CircularProgress } from '@material-ui/core';
import { ResponsivePie } from '@nivo/pie';

const styles = theme => ({
  homeButton: {
    a: {
      textDecoration: 'none',
    },
  },
  title: {
    textAlign: 'center',
  },
  statsDisplay: {
    height: 600,
  }
});

class APIspotify extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: Map(),
      loading: true,
    };

    this.fetchWiki = this.fetchWiki.bind(this);
    // const manager = new OAuthManager('Sideproject')
    // manager.configure({
    //   spotify: {
    //     client_id: '6947805ad8b04a51a6087080d3fd5633',
    //     client_secret: '93d3006c11984f1e8453de4eddc97510'
    //   }
    // });

    // manager.authorize('spotify', {scopes: 'user-read-email'})
    // .then(resp => console.log('Your users ID'))
    // .catch(err => console.log('There was an error'));

  }

  async componentDidMount() {
      this.setState({ 
        loading: false,
      })
    
  }

  fetchWiki(lang) {
    const { data } = this.state;

    // return fetch(`https://${lang}.wikipedia.org/w/api.php?action=query&meta=siteinfo&siprop=general%7Cnamespaces%7Cnamespacealiases%7Cstatistics&format=json&origin=*`)
    //   .then(res => res.json())
  }

  render() {
    const { data, loading } = this.state;
    const { classes } = this.props;

    return (
      <>
        <div className={classes.statsDisplay}>
          <h2 className={classes.title}>Spotify</h2>
          {loading && <div className={classes.title}><CircularProgress /></div>}
        
          
        </div>
      </>
    );
  }
}

export default withStyles(styles, { withTheme: true })(APIspotify);