import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import 'react-quill/dist/quill.snow.css';
import Select from 'react-select';
import { TwitterPicker } from 'react-color';
import PropTypes from 'prop-types';
import cx from 'classnames';
// import GradientPath from "gradient-path";
import { TextField, Checkbox, Switch, FormControlLabel, CircularProgress, Button, Drawer } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import debounce from 'debounce';
import { Map, List } from 'immutable';
import TimeLine from './TimeLine';
import Slider from './Slider';
import MapGLContainer from './MapGLContainer';
import TextEditor from './TextEditor';
import YearSelector from './YearSelector';
import GeoWorld from './GeoWorld';
import { withStyles } from "@material-ui/core/styles";
import { stringToColour, formatYear } from './utils';

import {
  romanEmpire200CE,
  romanEmpire69CE,
  romanEmpire14CE,
  romanEmpire60BCE,
  romanEmpire117CE,
} from '../../utils/geo/romanEmpire';

import pleiadesPoints from '../../utils/geo/pleiadesPoints';

import { geoWorld2000bc } from '../../utils/geo/geoWorld2000bc';
import { geoWorld1000bc } from '../../utils/geo/geoWorld1000bc';
import { geoWorld500bc } from '../../utils/geo/geoWorld500bc';
import { geoWorld323bc } from '../../utils/geo/geoWorld323bc';
import { geoWorld200bc } from '../../utils/geo/geoWorld200bc';
import { geoWorld0 } from '../../utils/geo/geoWorld0';
import { geoWorld400 } from '../../utils/geo/geoWorld400';
import { geoWorld600 } from '../../utils/geo/geoWorld600';
import { geoWorld800 } from '../../utils/geo/geoWorld800';
import { geoWorld1000 } from '../../utils/geo/geoWorld1000';
import { geoWorld1279 } from '../../utils/geo/geoWorld1279';
import { geoWorld1492 } from '../../utils/geo/geoWorld1492';
import { geoWorld1530 } from '../../utils/geo/geoWorld1530';
import { geoWorld1650 } from '../../utils/geo/geoWorld1650';
import { geoWorld1715 } from '../../utils/geo/geoWorld1715';
import { geoWorld1783 } from '../../utils/geo/geoWorld1783';
import { geoWorld1815 } from '../../utils/geo/geoWorld1815';
import { geoWorld1914 } from '../../utils/geo/geoWorld1914';
import { geoWorld1920 } from '../../utils/geo/geoWorld1920';
import { geoWorld1938 } from '../../utils/geo/geoWorld1938';
import { geoWorld1945 } from '../../utils/geo/geoWorld1945';
import { geoWorld1994 } from '../../utils/geo/geoWorld1994';

import {
  assyrian,
  inca,
  persian,
  goldenHordeMongol,
  alexander,
  sumerian,
  delianLeague,
  abbasidCaliphate,
  mongolYuan,
  mongolIlkhanate,
  mongolChagadai,
  holyRomanEmpire,
  // byzantine555,
  aztec,
  ancienEgypt,
  maliEmpire,
  umayyadCaliphate,
  ghanaEmpire,
  maya,
  hittites,
  babylonians,
  delhiSultanate,
  songhaiEmpire,
  guptaEmpire,
  phoenicians,
  mauryanEmpire,
  minoans,
  timuridEmpire,
  neoAssyrian,
  neoAssyrianPostPileser,
  peakNeoAssyrian,
} from '../../utils/geo/empires';

import {
  tangDynasty,
  qinDynasty223,
  qinDynasty209,
  qingDynasty,
  mingDynasty1389,
  mingDynasty1582,
  hanDynasty202,
  hanDynasty109,
  hanDynasty82,
  songDynasty,
  shangDynasty,
  zhouDynasty,
  xiaDynasty,
} from '../../utils/geo/chineseDynasties';

import { tmp } from './utils';

const throttle = (func, limit) => {
  let lastFunc
  let lastRan
  return function() {
    const context = this
    const args = arguments
    if (!lastRan) {
      func.apply(context, args)
      lastRan = Date.now()
    } else {
      clearTimeout(lastFunc)
      lastFunc = setTimeout(function() {
        if ((Date.now() - lastRan) >= limit) {
          func.apply(context, args)
          lastRan = Date.now()
        }
      }, limit - (Date.now() - lastRan))
    }
  }
}

class TimeLineComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedDate: null,
      dateList: null,
      activityList: null,
      editMode: false,
      selectedActivity: null,
      features: null,
      currentYear: 200,
      displayDrawer: false,
      hoveredFeature: null,
    };

    this.setEvent = this.setEvent.bind(this);
    this.deleteDate = this.deleteDate.bind(this);
    this.fetchDates = this.fetchDates.bind(this);
    this.postDate = this.postDate.bind(this);
    this.fetchActivity = this.fetchActivity.bind(this);
    this.toggleEditMode = this.toggleEditMode.bind(this);
    this.selectActivity = this.selectActivity.bind(this);
    this.setActivityList = this.setActivityList.bind(this);
    this.deleteActivity = this.deleteActivity.bind(this);
    this.setSelectedDate = this.setSelectedDate.bind(this);
    this.postActivity = this.postActivity.bind(this);
    this.onDrag = this.onDrag.bind(this);
    this.toggleDrawer = this.toggleDrawer.bind(this);
    this.onKeyup = this.onKeyup.bind(this);

    this.debouncedOnDrag = throttle(
      this.onDrag.bind(this),
      200
    );

    this.debouncedPostDate = debounce(
      this.postDate.bind(this),
      500
    );

    this.debouncedPostActivity = debounce(
      this.postActivity.bind(this),
      500
    );
  }

  componentDidUpdate(prevProps, prevState) {
    const { selectedActivity } = this.state;

    // if ((selectedActivity && !prevState.selectedActivity) || (selectedActivity && selectedActivity.get('title') !== prevState.selectedActivity.get('title'))) {
    //   const gp = new GradientPath({
    //     path: document.querySelector('#map path:not([fill="#666666"])'),
    //     segments: 30,
    //     samples: 3,
    //     precision: 2 // Optional
    //   });
      
    //   gp.render({
    //     type: "path",
    //     fill: [
    //       { color: "#C6FFDD", pos: 0 },
    //       { color: "#FBD786", pos: 0.25 },
    //       { color: "#F7797D", pos: 0.5 },
    //       { color: "#6DD5ED", pos: 0.75 },
    //       { color: "#C6FFDD", pos: 1 }
    //     ],
    //     width: 10,
    //     position: 'absolute',
    //   });
    // }
  }

  componentDidMount() {
    this.fetchDates();

    const { currentYear } = this.state;

    this.onDrag(currentYear);
    document.addEventListener('keyup', this.onKeyup);
  }

  onKeyup(event) {
    const { selectedDate, selectedActivity, displayDrawer } = this.state;
    if ((event.which === 38 || event.which === 32) && selectedDate && selectedActivity) {
      this.toggleDrawer();
    } else if ((event.which === 40 || event.which === 32) && displayDrawer) {
      this.toggleDrawer();
    }
  }

  fetchActivity() {
    const { selectedActivity } = this.state;
    const { type } = this.props;

    return fetch(`/api/activity?where={"type": "${type}"}`)
      .then(res => res.json())
      .then(activityList => {
        const stateActivityList = List(activityList.map(activity => Map(activity)));
        this.setState({ 
          activityList: stateActivityList,
          // selectedActivity: stateActivityList.get(0), // to remove
        });
      });
  }

  fetchDates() {
    return fetch('/api/event')
      .then(res => res.json())
      .then(dateList => {
        this.setState({ 
          dateList: List(dateList.map(date => Map(date))),
        });

        this.fetchActivity();

        // fetch('/api/event', {
        //   method: 'POST',
        //   headers: {
        //     'Accept': 'application/json',
        //     'Content-Type': 'application/json'
        //   },
        //   body: JSON.stringify(List(dateList.map(date => Map(date))).get(2).set('text', '<p>some text range 2</p>'))
        // });
      });
  }

  deleteDate(date) {
    fetch(`/api/event/${date.get('id')}`, {
      method: 'DELETE',
      body: JSON.stringify({})
    }).then(() => {
      this.fetchDates();
    });
  }

  postDate(date) {
    fetch('/api/event', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(date)
    })
    .then(res => res.json())
    .then((newDate) => {
      this.fetchDates().then(() => {
        this.setSelectedDate(Map(newDate))
      });
    });
  }

  postActivity(activity) {
    const { type } = this.props;

    fetch('/api/activity', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(activity.set('type', type))
    }).then(() => {
      this.fetchActivity();
    });
  }

  deleteActivity(activity) {
    fetch(`/api/activity/${activity.get('id')}`, {
      method: 'DELETE',
      body: JSON.stringify({})
    }).then(() => {
      this.fetchActivity();
    });
  }

  setActivityList(path, value) {
    const { activityList } = this.state;

    const newActivityList = activityList.setIn(path, value);

    this.setState({
      activityList: newActivityList
    })

    this.debouncedPostActivity(newActivityList.get(path[0]));
  }

  selectActivity(activity) {
    const { selectedActivity } = this.state;

    this.setState({
      selectedActivity: activity,
      displayDrawer: selectedActivity && activity && selectedActivity.get('title') === activity.get('title'),
    });  
  }

  setEvent(field, value) {
    const { dateList, selectedDate } = this.state;

    const dateListIndex = dateList.findIndex(date => date.get('id') === selectedDate.get('id'));

    const newDateList = dateList.setIn([dateListIndex, field], value);

    this.setState({
      dateList: newDateList,
      selectedDate: selectedDate.set(field, value),
    })

    // this.debouncedPostDate(newDateList.get(dateListIndex));
  }

  toggleEditMode() {
    const { editMode } = this.state;

    this.setState({
      editMode: !editMode,
    });
  }

  setSelectedDate(selectedDate) {
    this.setState({
      selectedDate,
    });
  }

  onDrag(toYear) {
    this.setState({
      currentYear: toYear,
      features: {
        "type": "FeatureCollection",
        "features": []
          .concat(geoWorld2000bc)
          .concat(geoWorld1000bc)
          .concat(geoWorld500bc)
          .concat(geoWorld323bc)
          .concat(geoWorld200bc)
          .concat(geoWorld0)
          .concat(geoWorld400)
          .concat(geoWorld600)
          .concat(geoWorld800)
          .concat(geoWorld1000)
          .concat(geoWorld1279)
          .concat(geoWorld1492)
          .concat(geoWorld1530)
          .concat(geoWorld1650)
          .concat(geoWorld1715)
          .concat(geoWorld1783)
          .concat(geoWorld1815)
          .concat(geoWorld1914)
          .concat(geoWorld1920)
          .concat(geoWorld1938)
          .concat(geoWorld1945)
          .concat(geoWorld1994)
          .filter(featureCollection => featureCollection.properties.from < toYear && featureCollection.properties.to > toYear)
          .map(featureCollection => featureCollection.features)
          .reduce(function(pre, cur) {
              return pre.concat(cur);
          }, [])
          // .concat(romanEmpire60BCE.features)
          // .concat(romanEmpire200CE.features)
          // .concat(romanEmpire69CE.features)
          // .concat(romanEmpire14CE.features)
          // .concat(romanEmpire117CE.features)
          // .concat(assyrian.features)
          // .concat(inca.features)
          // .concat(persian.features)
          // .concat(goldenHordeMongol.features)
          // .concat(alexander.features)
          // .concat(sumerian.features)
          // .concat(delianLeague.features)
          // .concat(abbasidCaliphate.features)
          // .concat(mongolIlkhanate.features)
          // .concat(mongolYuan.features)
          // .concat(mongolChagadai.features)
          // .concat(holyRomanEmpire.features)
          // .concat(byzantine555.features)
          // .concat(aztec.features)
          // .concat(ancienEgypt.features)
          // .concat(maliEmpire.features)
          // .concat(umayyadCaliphate.features)
          // .concat(ghanaEmpire.features)
          // .concat(maya.features)
          // .concat(babylonians.features)
          // .concat(hittites.features)
          // .concat(guptaEmpire.features)
          // .concat(delhiSultanate.features)
          // .concat(phoenicians.features)
          // .concat(songhaiEmpire.features)
          // .concat(mauryanEmpire.features)
          // .concat(tangDynasty.features)
          // .concat(minoans.features)
          // .concat(timuridEmpire.features)
          // .concat(neoAssyrian.features)
          // .concat(neoAssyrianPostPileser.features)
          // .concat(peakNeoAssyrian.features)
          // .concat(qinDynasty223.features)
          // .concat(qinDynasty209.features)
          // .concat(qingDynasty.features)
          // .concat(mingDynasty1389.features)
          // .concat(mingDynasty1582.features)
          // .concat(hanDynasty202.features)
          // .concat(hanDynasty109.features)
          // .concat(hanDynasty82.features)
          // .concat(songDynasty.features)
          // .concat(shangDynasty.features)
          // .concat(zhouDynasty.features)
          // .concat(xiaDynasty.features)
          .filter(feature => feature.properties && feature.properties.from && feature.properties.to ? feature.properties.from <= toYear && feature.properties.to > toYear : true)
          .filter(feature => feature.properties && feature.properties.name !== "unclaimed")
          .filter(feature => feature.properties && !['Africa', 'Madagascar', 'Antarctica'].includes(feature.properties.name))
          .map((feature, index) => feature.id || feature.properties.name === "unclaimed" ? feature : Object.assign(feature, {'id': feature.properties.name}))
          .map((feature) => 
            Object.assign(feature, {
              'properties': {
                ...feature.properties,
                'color': stringToColour(feature.id)
              }
            })
          )
      }
    });   
  }

  toggleDrawer() {
    const { displayDrawer } = this.state;

    this.setState({
      displayDrawer: !displayDrawer,
    })
  }

  toggleTo(direction) {
    var event = document.createEvent("HTMLEvents");
    event.initEvent("dataavailable", true, true);
    event.eventName = "dataavailable";
    event.which = direction === 'prev' ? 37 : 39;
    document.dispatchEvent(event);
  }

  render() {
    const { selectedDate, dateList, editMode, activityList, selectedActivity, features, currentYear, displayDrawer, viewport } = this.state;
    const { displaySlider, displayMap, classes } = this.props;
    
    if (!activityList || !dateList) {
      return (<div style={{textAlign: 'center', marginTop: 30}}>
        <CircularProgress />
      </div>)
    }

    return (
      <>
        {displayMap &&  <div style={{height: '100vh'}}>
          <MapGLContainer
            features={features}
            points={
              pleiadesPoints.features
              .filter(feature => feature.geometry.coordinates[0] && feature.geometry.coordinates[1])
              .filter(feature => feature.properties && feature.properties.from && feature.properties.to ? feature.properties.from <= currentYear && feature.properties.to > currentYear : true)
            }
            editMode={editMode}
            onClick={(data) =>
              this.selectActivity(
                data ? activityList
                  .find(activity => 
                    activity.get('title') === data.label || 
                    activity.get('title') === data.id || 
                    (data.properties.id && activity.get('title') === data.properties.id) || 
                    (data.properties.name && activity.get('title') === data.properties.name)
                  ) : null
              )
            }
          />
        </div>}

        {/* {displayMap && <div id="map"><GeoWorld
          data={features
            .filter(feature => feature.properties.name && feature.properties.name !== "unclaimed")
            .map(feature => [{
              "id": feature.id,
              "value": stringToNumber(feature.id)
            }]).reduce(function(pre, cur) {
              return pre.concat(cur);
          }, [])}
          features={features}
          onClick={(data) => 
            this.selectActivity(
              activityList
                .find(activity => 
                  activity.get('title') === data.label || 
                  activity.get('title') === data.id || 
                  (data.properties.id && activity.get('title') === data.properties.id)
                )
            )
          }
        /></div>} */}

        <div className={cx(classes.edit, editMode ? classes.editOn : null)}>
          <EditIcon onClick={this.toggleEditMode}/>
        </div>

        {displaySlider && <Slider
          entityList={activityList}
          selectEntity={this.selectActivity}
          editMode={false}
          deleteEntity={this.deleteActivity}
          postEntity={this.postActivity}
          selectedEntity={selectedActivity}
        />}

        {editMode && <div className={classes.addEvent}><Button 
          variant="contained" 
          onClick={() => {this.postDate({
            type: 'range', innerText: '', text: '<p></p>', color: 'white', activity: { id: selectedActivity.get('id')}, background: 'repeating-linear-gradient(45deg, #606dbc, #606dbc 10px, #465298 10px, #465298 20px)', date: moment().format("YYYY-MM-DD HH:mm:ss"), endDate: moment().add(1, 'year').format("YYYY-MM-DD HH:mm:ss")
          })}}
        >
          Add Event
        </Button></div>}

        {displayMap && <div className={classes.timeLine}><TimeLine
          dateList={selectedActivity ? dateList.filter(date => date.get('activity').id === selectedActivity.get('id')) : []}
          pointSize={20}
          lineHeight={50}
          editMode={editMode}
          setSelectedDate={this.setSelectedDate}
          onDrag={this.debouncedOnDrag}
          postDate={this.setEvent}
          currentYear={currentYear}
          displayHelpers
        /></div>}

        {selectedDate && selectedActivity && <div className={classes.toggleDrawer}>
          <ExpandLessIcon className={classes.drawerIcon} onClick={this.toggleDrawer}/>
        </div>}

        <Drawer anchor="bottom" open={displayDrawer} onClose={this.toggleDrawer}>
          <div className={classes.editorContainer}>
            {selectedDate &&  (
              <div className={classes.drawer}>
                <CloseIcon fontSize='large' onClick={this.toggleDrawer}  className={classes.closeDrawer}/>

                {editMode && (
                  <>
                    <TextField
                      label="Inner text" 
                      value={selectedDate.get('innerText')} 
                      onChange={(event) => this.setEvent('innerText', event.target.value)} 
                    />
                    <TextField
                      label="Background"
                      style={{width: 800}}
                      value={selectedDate.get('background')} 
                      onChange={(event) => this.setEvent('background', event.target.value)} 
                    />
                    <DeleteIcon style={{cursor: 'pointer'}} onClick={() => this.deleteDate(selectedDate)} />
                    <SelectRangeText>
                      <Select
                        defaultValue={{value: selectedDate.get('type'), label: selectedDate.get('type')}}
                        options={[{value: 'range', label: 'range'}, {value: 'point', label: 'point'}]}
                      />
                    </SelectRangeText>
                    
                    <TwitterPicker
                      triangle='hide'
                      width="100%"
                      color={selectedDate.get('color')}
                      onChange={(color) => this.setEvent('color', color.hex)}
                      colors={["#f44336", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5", "#2196f3", "#03a9f4", "#00bcd4", "#009688", "#4caf50", "#8bc34a", "#cddc39", "#ffeb3b", "#ffc107", "#ff9800", "#ff5722", "#795548", "#ffffff"]}
                    />
                    <CalendarContainer>
                      <FormControlLabel
                        control={<Checkbox checked={selectedDate.get('isDateBC')} onChange={(event) => this.setEvent('isDateBC', event.target.checked)} name="checkedA" />}
                        label="isDateBC"
                      />
                      <YearSelector
                        defaultValue={moment(selectedDate.get('date')).year()}
                        onSelect={(date) => this.setEvent('date', formatYear(date))}
                        options={[...Array(5001).keys()].map(year => ({value: year, label: year}))}
                      />
                    </CalendarContainer>
                    {selectedDate.get('type') === 'range' && 
                      <CalendarContainer>
                        <FormControlLabel
                        control={<Checkbox checked={selectedDate.get('isEndDateBC')} onChange={(event) => this.setEvent('isEndDateBC', event.target.checked)} name="checkedA" />}
                        label="isDateBC"
                      />
                        <YearSelector
                          defaultValue={moment(selectedDate.get('endDate')).year()}
                          onSelect={(date) => this.setEvent('endDate', formatYear(date))}
                          options={[...Array(5001).keys()].map(year => ({value: year, label: year}))}
                        />
                      </CalendarContainer>
                    }
                  </>
                )}

                <div className={classes.header}>
                  <div className={classes.arrowRight} onClick={() => this.toggleTo('left')}><KeyboardArrowLeftIcon fontSize='large' /></div>
                  <h1 className={classes.title}>{ selectedDate.get('innerText') }</h1>
                  <div className={classes.arrowLeft} onClick={() => this.toggleTo('right')}><KeyboardArrowRightIcon fontSize='large' /></div>
                </div>

                {dateList.map((date) => (
                  <>
                    {selectedDate && selectedDate.get('id') === date.get('id') && (
                      <TextEditor 
                        text={date.get('text')} 
                        onChangeText={(text) => this.setEvent('text', text)}
                      />
                    )}
                  </>
                ))}
              </div>
            )}
          </div>
        </Drawer>
      </>
    );
  }
}

const CalendarContainer = styled.div`
  margin: auto;
  display: inline-block;

`;

const SelectRangeText = styled.div`
  width: 150px;
  padding: 10px;
  display: inline-block;
`;

const styles = theme => ({
  title: {
    textAlign: 'center',
  },
  header: {
    
  },
  edit: {
    position: 'absolute',
    cursor: 'pointer',
    top: 70,
    right: 20,
    opacity: 0.65,

    '&:hover': {
      color: 'white',
    },
  },
  editOn: {
    color: 'white',
  },
  addEvent: {
    position: 'absolute',
    cursor: 'pointer',
    bottom: 100,
    left: 20,
    opacity: 0.65,
    zIndex: 10,

    '&:hover': {
      color: 'white',
    },
  },
  arrowRight: {
    fontSize: 30,
    float: 'left',
    cursor: 'pointer',
  },
  arrowLeft: {
    fontSize: 30,
    float: 'right',
    cursor: 'pointer',
  },
  timeLine: {
    position: 'absolute',
    opacity: 0.65,
    width: '100vw',
    bottom: 20,
  },
  drawer: {
    color: theme.color,
    backgroundColor: theme.backgroundColor,

    opacity: 1,
    animationName: `$fadeInOpacity`,
    animationIterationCount: 1,
    animationTimingFunction: 'ease-in',
    animationDuration: '0.5s',
  },
  '@keyframes fadeInOpacity': {
    '0%': {
      opacity: 0,
    },
    '100%': {
      opacity: 1,
    }
  },
  toggleDrawer: {
    position: 'absolute',
    bottom: 60,
    marginLeft: 'auto',
    marginRight: 'auto',
    left: 0,
    right: 0,
    cursor: 'pointer',
    textAlign: 'center',
    fontSize: 60,
  },
  drawerIcon: {
    fontSize: 50,
  },
  editorContainer: {
    color: theme.color,
    backgroundColor: theme.backgroundColor,
    padding: '10px',
    display: 'inline-block',
  },
  closeDrawer: {
    float: 'right',
    padding: 5,
    cursor: 'pointer',
  }
});

TimeLineComponent.defaultProps = {
  displaySlider: true,
  displayMap: false,
};

TimeLineComponent.propTypes = {
  type: PropTypes.string.isRequired,
  displaySlider: PropTypes.bool,
  displayMap: PropTypes.bool,
};

export default withStyles(styles, { withTheme: true })(TimeLineComponent);
