import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveChoropleth } from '@nivo/geo'
import { franceFeature } from '../../utils/geo/geoFeatures';
import { List, Map } from 'immutable';
import { withStyles } from "@material-ui/core/styles";
import { ResponsiveLine } from '@nivo/line';
import moment from 'moment';
import { CircularProgress } from '@material-ui/core';

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

class APIgouvFr extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      valueList: [],
      dataList: [],
      tempList: null,
      loading: true,
    };

    this.fetchTempForStation = this.fetchTempForStation.bind(this);
    this.getEntireUserList = this.getEntireUserList.bind(this);
    this.setTempList = this.setTempList.bind(this);
  }

  componentDidMount() {
    // const data = [
    //   {
    //     "id": "stylus",
    //     "label": "stylus",
    //     "value": 381,
    //     "color": "hsl(14, 70%, 50%)"
    //   },
    //   {
    //     "id": "php",
    //     "label": "php",
    //     "value": 390,
    //     "color": "hsl(191, 70%, 50%)"
    //   },
    //   {
    //     "id": "python",
    //     "label": "python",
    //     "value": 16,
    //     "color": "hsl(180, 70%, 50%)"
    //   },
    //   {
    //     "id": "make",
    //     "label": "make",
    //     "value": 468,
    //     "color": "hsl(113, 70%, 50%)"
    //   },
    //   {
    //     "id": "c",
    //     "label": "c",
    //     "value": 285,
    //     "color": "hsl(128, 70%, 50%)"
    //   }
    // ];

    //https://www.omdbapi.com/?apikey=7f985fa2&s=tes
    // fetch('https://api-nba-v1.p.rapidapi.com/seasons/', {
    //     headers: {
    //       'x-rapidapi-host': 'api-nba-v1.p.rapidapi.com',
    //       'x-rapidapi-key': '9439042916mshb9eb42aa2df8787p1dec08jsn2018fc70a5f0',
    //       'useQueryString': true,
    //     },
    //   })
    //   .then(res => res.json())
    //   .then(sideProjectList => {
    //     // setSideProjectList(List(sideProjectList.map(activity => Map(activity))));
    //   });

    
    fetch('https://hubeau.eaufrance.fr/api/v1/temperature/station?size=1000')
      .then(res => res.json())
      .then(data => {
        let valueList = [];
        let dataList = [];
        data.data.forEach(data => {
          if (valueList.find(mesureItem => data.libelle_station === mesureItem['id']) === undefined) {
            valueList = valueList.concat([{"id": data.libelle_station, "type": "Feature", "geometry": {"type": "Point", "coordinates": [data.longitude, data.latitude]}, "properties": {"name": data.libelle_station}}]);
            dataList = dataList.concat([{
              "id": data.libelle_station,
              "value": 2020 - parseInt(moment(data.date_maj_infos).format('YYYY')),
              code_station: data.code_station
            }]);
          }
        });
        this.setState({ 
          valueList,
          dataList,
          loading: false,
        });
      });
  }

  getUsers(stationCode, pageNo) {
    return fetch('https://hubeau.eaufrance.fr/api/v1/temperature/chronique?date_debut_mesure='+pageNo+'&size=5000&code_station=' + stationCode)
    .then(res => res.json());
  }

  async getEntireUserList(stationCode, pageNo = 1) {
    const data = await this.getUsers(stationCode, pageNo);
    console.log("Retreiving data from API for page : " + pageNo);
    if (data && data.data.length>0) {
      const lastDate = moment(data.data[data.data.length -1].date_mesure_temp).add(1, 'day').format("YYYY-MM-DD");
      const formattedData = this.formatData(data.data);

      // this.setTempList(formattedData);
      
      return data.data.concat(await this.getEntireUserList(stationCode, lastDate));
    } else {
      return data.data;
    }
  };

  setTempList(formattedData) {
    const { tempList } = this.state;

    if (tempList) {
      formattedData[0]["data"] = formattedData[0]["data"].concat(tempList[0]["data"]);
    }

    this.setState({ 
      tempList: formattedData 
    });
  }

  formatData(results) {
    var flags = {};
    let valueList = [];
    results.forEach(data => {
      const date = moment(data.date_mesure_temp).format("YYYY-MM");
      if (!flags[date]) {
        

        flags[date] = true;
      valueList = valueList.concat([{
        "x": date,
        "y": data.resultat
      }])
    }
  });

  return [
    {
      "id": "station",
      "color": "hsl(85, 70%, 50%)",
      "data": valueList,
    }];
  }

  async fetchTempForStation(stationCode) {
    this.setState({ loading: true });

    const results = await this.getEntireUserList(stationCode, "2000-12-01");
    console.log(this.formatData(results));
    this.setState({ loading: false, tempList: this.formatData(results) });
  }

  render() {
    const { valueList, dataList, tempList, loading } = this.state;
    const { classes } = this.props;

    return (
      <>
        <div className={classes.statsDisplay}>
          <h2 className={classes.title}>Stations détection température rivière</h2>
          {loading && <div className={classes.title}><CircularProgress /></div>}
        
          <ResponsiveChoropleth
            data={dataList}
            features={[franceFeature].concat(valueList)}
            onClick={feature =>
              this.fetchTempForStation(feature.data.code_station)
            } // goToSearch(feature, modelLoaded, 'equal')
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            colors="nivo"
            domain={[0, 20]}
            unknownColor="#666666"
            label="properties.name"
            valueFormat=".1s"
            projectionScale={2200}
            projectionTranslation={[0.435, 3.9]}
            projectionRotation={[0, 0, 0]}
            enableGraticule
            graticuleLineColor="#dddddd"
            borderWidth={0.5}
            borderColor="#152538"
            gridYValues={['2008-09-01']}
            legends={[
              {
                label: 'test',
                title: 'test',
                name: 'test',
                anchor: 'bottom-left',
                direction: 'column',
                justify: true,
                translateX: 20,
                translateY: -100,
                itemsSpacing: 0,
                itemWidth: 94,
                itemHeight: 18,
                itemDirection: 'left-to-right',
                itemTextColor: '#444444',
                itemOpacity: 0.85,
                symbolSize: 17,
                effects: [
                  {
                    on: 'hover',
                    style: {
                      itemTextColor: '#000000',
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]}
          />
          {tempList && <ResponsiveLine
            data={tempList}
            margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
            xScale={{ type: 'point' }}
            yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
                orient: 'bottom',
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'date',
                legendOffset: 36,
                legendPosition: 'middle'
            }}
            axisLeft={{
                orient: 'left',
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'temp',
                legendOffset: -40,
                legendPosition: 'middle'
            }}
            colors={{ scheme: 'nivo' }}
            enablePoints={false}
            pointSize={10}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            pointLabel="y"
            pointLabelYOffset={-12}
            useMesh={true}
            legends={[
                {
                    anchor: 'bottom-right',
                    direction: 'column',
                    justify: false,
                    translateX: 100,
                    translateY: 0,
                    itemsSpacing: 0,
                    itemDirection: 'left-to-right',
                    itemWidth: 80,
                    itemHeight: 20,
                    itemOpacity: 0.75,
                    symbolSize: 12,
                    symbolShape: 'circle',
                    symbolBorderColor: 'rgba(0, 0, 0, .5)',
                    effects: [
                        {
                            on: 'hover',
                            style: {
                                itemBackground: 'rgba(0, 0, 0, .03)',
                                itemOpacity: 1
                            }
                        }
                    ]
                }
            ]}
          />}
        </div>
      </>
    );
  }
}

export default withStyles(styles, { withTheme: true })(APIgouvFr);