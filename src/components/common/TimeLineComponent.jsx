import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import 'react-quill/dist/quill.snow.css';
import Select from 'react-select';
import { TwitterPicker } from 'react-color';
import PropTypes from 'prop-types';
import { TextField, Checkbox, Switch, FormControlLabel, CircularProgress, Button } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import debounce from 'debounce';
import { Map, List } from 'immutable';
import TimeLine from './TimeLine';
import Slider from './Slider';
import TextEditor from './TextEditor';
import YearSelector from './YearSelector';
import GeoWorld from './GeoWorld';
import MapBoxGl from './MapBoxGl';

import {
  romanEmpire200CE,
  romanEmpire69CE,
  romanEmpire14CE,
  romanEmpire60BCE,
  romanEmpire117CE,
} from '../../utils/romanEmpire';

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
} from '../../utils/empires';

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
} from '../../utils/chineseDynasties';

import { tmp } from './utils';

class TimeLineComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedDate: null,
      dateList: null,
      activityList: null,
      displayEdition: false,
      selectedActivity: null,
      features: [],
      lng: 5,
      lat: 34,
      zoom: 2
    }

    this.setEvent = this.setEvent.bind(this);
    this.deleteDate = this.deleteDate.bind(this);
    this.fetchDates = this.fetchDates.bind(this);
    this.postDate = this.postDate.bind(this);
    this.fetchActivity = this.fetchActivity.bind(this);
    this.toggleDisplayEdition = this.toggleDisplayEdition.bind(this);
    this.selectActivity = this.selectActivity.bind(this);
    this.setActivityList = this.setActivityList.bind(this);
    this.deleteActivity = this.deleteActivity.bind(this);
    this.setSelectedDate = this.setSelectedDate.bind(this);
    this.postActivity = this.postActivity.bind(this);
    this.onDrag = this.onDrag.bind(this);

    this.debouncedPostDate = debounce(
      this.postDate.bind(this),
      500
    );

    this.debouncedPostActivity = debounce(
      this.postActivity.bind(this),
      500
    );
  }

  componentDidMount() {
    this.fetchDates();
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
        });

        if (!selectedActivity) {
          this.selectActivity(stateActivityList.get(0));
        }
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
    if (!activity) {
      return;
    }

    this.setState({
      selectedActivity: activity,
    });  
  }

  setEvent(field, value) {
    debugger;
    const { dateList, selectedDate } = this.state;

    const dateListIndex = dateList.findIndex(date => date.get('id') === selectedDate.get('id'));

    const newDateList = dateList.setIn([dateListIndex, field], value);

    this.setState({
      dateList: newDateList,
      selectedDate: selectedDate.set(field, value),
    })

    this.debouncedPostDate(newDateList.get(dateListIndex));
  }

  toggleDisplayEdition() {
    const { displayEdition } = this.state;

    this.setState({
      displayEdition: !displayEdition,
    });
  }

  setSelectedDate(selectedDate) {
    this.setState({
      selectedDate,
    });
  }

  formatYear(year) {
    return moment(year.toString().padStart(4, '0'), 'YYYY').format("YYYY-MM-DD HH:mm:ss");
  }

  onDrag(toYear) {
    console.log(toYear);
    this.setState({
      features: []
        .concat(romanEmpire60BCE.features)
        .concat(romanEmpire200CE.features)
        .concat(romanEmpire69CE.features)
        .concat(romanEmpire14CE.features)
        .concat(romanEmpire117CE.features)
        .concat(assyrian.features)
        .concat(inca.features)
        .concat(persian.features)
        .concat(goldenHordeMongol.features)
        .concat(alexander.features)
        .concat(sumerian.features)
        .concat(delianLeague.features)
        .concat(abbasidCaliphate.features)
        .concat(mongolIlkhanate.features)
        .concat(mongolYuan.features)
        .concat(mongolChagadai.features)
        .concat(holyRomanEmpire.features)
        // .concat(byzantine555.features)
        .concat(aztec.features)
        .concat(ancienEgypt.features)
        .concat(maliEmpire.features)
        .concat(umayyadCaliphate.features)
        .concat(ghanaEmpire.features)
        .concat(maya.features)
        .concat(babylonians.features)
        .concat(hittites.features)
        .concat(guptaEmpire.features)
        .concat(delhiSultanate.features)
        .concat(phoenicians.features)
        .concat(songhaiEmpire.features)
        .concat(mauryanEmpire.features)
        .concat(tangDynasty.features)
        .concat(minoans.features)
        .concat(timuridEmpire.features)
        .concat(neoAssyrian.features)
        .concat(neoAssyrianPostPileser.features)
        .concat(peakNeoAssyrian.features)
        .concat(qinDynasty223.features)
        .concat(qinDynasty209.features)
        .concat(qingDynasty.features)
        .concat(mingDynasty1389.features)
        .concat(mingDynasty1582.features)
        .concat(hanDynasty202.features)
        .concat(hanDynasty109.features)
        .concat(hanDynasty82.features)
        .concat(songDynasty.features)
        .concat(shangDynasty.features)
        .concat(zhouDynasty.features)
        .concat(xiaDynasty.features)
        .filter(feature => feature.properties.from < toYear && feature.properties.to > toYear)
    });   
  }

  render() {
    const { selectedDate, dateList, displayEdition, activityList, selectedActivity, features } = this.state;
    const { displaySlider, displayMap } = this.props;
    
    if (!activityList || !dateList) {
      return (<div style={{textAlign: 'center'}}>
        <CircularProgress />
      </div>)
    }

    return (
      <>
        {displayMap && selectedActivity && <TimeLine
          dateList={[]}
          pointSize={20}
          lineHeight={50}
          setSelectedDate={this.setSelectedDate}
          onDrag={this.onDrag}
          displayHelpers
        />}

        {displayMap && <div>
          <MapBoxGl
            features={features}
          />
        </div>}

        {/* {displayMap && <GeoWorld
          data={tmp}
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
        />} */}

        {displaySlider && <Slider
          entityList={activityList}
          selectEntity={this.selectActivity}
          displayEdition={false}
          deleteEntity={this.deleteActivity}
          postEntity={this.postActivity}
          selectedEntity={selectedActivity}
        />}

        <div><FormControlLabel
          control={<Switch
            checked={displayEdition}
            onChange={this.toggleDisplayEdition}
            name="checkedB"
            color="primary"
          />}
          label="Editer"
        /></div>

        {displayEdition && <Button 
          variant="contained" 
          onClick={() => {this.postDate({
            type: 'range', innerText: '', text: '<p></p>', color: 'white', activity: { id: selectedActivity.get('id')}, background: 'repeating-linear-gradient(45deg, #606dbc, #606dbc 10px, #465298 10px, #465298 20px)', date: moment().format("YYYY-MM-DD HH:mm:ss"), endDate: moment().add(1, 'year').format("YYYY-MM-DD HH:mm:ss")
          })}}
        >
          Add Event
        </Button>}

        {selectedActivity && <TimeLine
          dateList={dateList.filter(date => date.get('activity').id === selectedActivity.get('id'))}
          pointSize={20}
          lineHeight={50}
          setSelectedDate={this.setSelectedDate}
        />}

        <EditorContainer>
          {selectedDate &&  (
            <>
              {displayEdition && (
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
                      onSelect={(date) => this.setEvent('date', this.formatYear(date))}
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
                        onSelect={(date) => this.setEvent('endDate', this.formatYear(date))}
                        options={[...Array(5001).keys()].map(year => ({value: year, label: year}))}
                      />
                    </CalendarContainer>
                  }
                </>
              )}

              {dateList.map((date) => (
                <ContentDate>
                  {selectedDate && selectedDate.get('id') === date.get('id') && (
                    <TextEditor 
                      text={date.get('text')} 
                      onChangeText={(text) => this.setEvent('text', text)}
                    />
                  )}
                </ContentDate>
              ))}
            </>
          )}
        </EditorContainer>
      </>
    );
  }
}

const CalendarContainer = styled.div`
  margin: auto;
  display: inline-block;
  padding: 20px;
`;

const SelectRangeText = styled.div`
  width: 150px;
  padding: 10px;
  display: inline-block;
`;

const EditorContainer = styled.div`
  padding: 20px;
`;

const ContentDate = styled.div`
  padding: 10px;
  display: inline-block;
`;

TimeLineComponent.defaultProps = {
  displaySlider: true,
  displayMap: false,
};

TimeLineComponent.propTypes = {
  type: PropTypes.string.isRequired,
  displaySlider: PropTypes.bool,
  displayMap: PropTypes.bool,
};

export default TimeLineComponent;
