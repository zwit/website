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

class APIwiki extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: Map(),
      loading: true,
    };

    this.fetchWiki = this.fetchWiki.bind(this);
  }

  async componentDidMount() {
    let fetchedData = Map();
    // ['en', 'fr'].forEach(lang => {
      
    // }).then(() => );

    await this.fetchWiki('fr')
      .then((data) => {
        fetchedData = fetchedData.set('fr', data.query);
      });
      await this.fetchWiki('en')
      .then((data) => {
        fetchedData = fetchedData.set('en', data.query);
      });
      await this.fetchWiki('es')
      .then((data) => {
        fetchedData = fetchedData.set('es', data.query);
      });
      await this.fetchWiki('it')
      .then((data) => {
        fetchedData = fetchedData.set('it', data.query);
      });
      await this.fetchWiki('ru')
      .then((data) => {
        fetchedData = fetchedData.set('ru', data.query);
      });
      await this.fetchWiki('de')
      .then((data) => {
        fetchedData = fetchedData.set('de', data.query);
      });
      await this.fetchWiki('zh')
      .then((data) => {
        fetchedData = fetchedData.set('zh', data.query);
      });
      await this.fetchWiki('hi')
      .then((data) => {
        fetchedData = fetchedData.set('hi', data.query);
      });
      await this.fetchWiki('ar')
      .then((data) => {
        fetchedData = fetchedData.set('ar', data.query);
      });
      await this.fetchWiki('pt')
      .then((data) => {
        fetchedData = fetchedData.set('pt', data.query);
      });
      await this.fetchWiki('ja')
      .then((data) => {
        fetchedData = fetchedData.set('ja', data.query);
      });
      this.setState({ 
        data: fetchedData,
        loading: false,
      })
    
  }

  fetchWiki(lang) {
    const { data } = this.state;

    return fetch(`https://${lang}.wikipedia.org/w/api.php?action=query&meta=siteinfo&siprop=general%7Cnamespaces%7Cnamespacealiases%7Cstatistics&format=json&origin=*`)
      .then(res => res.json())
  }

  render() {
    const { data, loading } = this.state;
    const { classes } = this.props;

    const pieData = [];
    
    data.forEach((dataForLang, key) => pieData.push({
      "id": key,
      "label": key,
      "value": dataForLang.statistics.pages,
    }));

    console.log(data, pieData);

    return (
      <>
        <div className={classes.statsDisplay}>
          <h2 className={classes.title}>Nombres page Wiki par langue</h2>
          {loading && <div className={classes.title}><CircularProgress /></div>}
        
          {data.size && <div  className={classes.title}>
            {/* {Object.entries(data.statistics).map(value => (
              <div>Number of pages {value[0]}: {value[1]}</div>
            ))} */}
<div className={classes.statsDisplay}>
<ResponsivePie
        data={pieData}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        colors={{ scheme: 'nivo' }}
        borderWidth={1}
        borderColor={{ from: 'color', modifiers: [ [ 'darker', 0.2 ] ] }}
        radialLabelsSkipAngle={10}
        radialLabelsTextXOffset={6}
        radialLabelsTextColor="#333333"
        radialLabelsLinkOffset={0}
        radialLabelsLinkDiagonalLength={16}
        radialLabelsLinkHorizontalLength={24}
        radialLabelsLinkStrokeWidth={1}
        radialLabelsLinkColor={{ from: 'color' }}
        slicesLabelsSkipAngle={10}
        slicesLabelsTextColor="#333333"
        animate={true}
        motionStiffness={90}
        motionDamping={15}
        defs={[
            {
                id: 'dots',
                type: 'patternDots',
                background: 'inherit',
                color: 'rgba(255, 255, 255, 0.3)',
                size: 4,
                padding: 1,
                stagger: true
            },
            {
                id: 'lines',
                type: 'patternLines',
                background: 'inherit',
                color: 'rgba(255, 255, 255, 0.3)',
                rotation: -45,
                lineWidth: 6,
                spacing: 10
            }
        ]}
        fill={[
            {
                match: {
                    id: 'ruby'
                },
                id: 'dots'
            },
            {
                match: {
                    id: 'c'
                },
                id: 'dots'
            },
            {
                match: {
                    id: 'go'
                },
                id: 'dots'
            },
            {
                match: {
                    id: 'python'
                },
                id: 'dots'
            },
            {
                match: {
                    id: 'scala'
                },
                id: 'lines'
            },
            {
                match: {
                    id: 'lisp'
                },
                id: 'lines'
            },
            {
                match: {
                    id: 'elixir'
                },
                id: 'lines'
            },
            {
                match: {
                    id: 'javascript'
                },
                id: 'lines'
            }
        ]}
        legends={[
            {
                anchor: 'bottom',
                direction: 'row',
                translateY: 56,
                itemWidth: 100,
                itemHeight: 18,
                itemTextColor: '#999',
                symbolSize: 18,
                symbolShape: 'circle',
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemTextColor: '#000'
                        }
                    }
                ]
            }
        ]}
    /></div>
          </div>}
        </div>
      </>
    );
  }
}

export default withStyles(styles, { withTheme: true })(APIwiki);