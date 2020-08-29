import React, { useEffect, useState } from 'react';
import { List, Map } from 'immutable';
import { withStyles } from "@material-ui/core/styles";
import { ResponsivePie } from '@nivo/pie';
import { TextField, CircularProgress } from '@material-ui/core';
import debounce from 'debounce';

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

class APIomdb extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: Map(),
      loading: false,
      search: '',
    };

    this.searchAPI = this.searchAPI.bind(this);
    this.debouncedSearchAPI = debounce(
      this.searchAPI.bind(this),
      500
    );
  }

  setSearch(search) {
    this.setState({ 
      search,
    });

    this.debouncedSearchAPI(search);
  }

  async searchAPI(search) {
    this.setState({ 
      loading: true,
    })
    const data = await fetch(`http://www.omdbapi.com/?t=${encodeURI(search)}&apikey=7f985fa2`)
      .then(res => res.json());

      this.setState({ 
        loading: false,
        data,
      })
  }

  render() {
    const { data, loading, search } = this.state;
    const { classes } = this.props;
    
    return (
      <>
        <div className={classes.statsDisplay}>
          <h2 className={classes.title}>OMDb</h2>
          
          {data && <div className={classes.title}>
            <TextField
              label="search" 
              value={search} 
              onChange={(event) => this.setSearch(event.target.value)} 
            />
            {loading && <div className={classes.title}><CircularProgress /></div>}
            <pre>{JSON.stringify(data, null, 2) }</pre>
          </div>}
        </div>
      </>
    );
  }
}

export default withStyles(styles, { withTheme: true })(APIomdb);