import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Circle from '../forms/Circle';
import moment from 'moment';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { TwitterPicker } from 'react-color';
import { TextField, Switch, FormControlLabel, CardActionArea, Card, CardMedia, Typography, CardContent } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import DeleteIcon from '@material-ui/icons/Delete';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import debounce from 'debounce';
import { Map, List } from 'immutable';
import backgroundMedieval from '../../images/background-medieval.png';
import InfiniteCalendar from 'react-infinite-calendar';
import 'react-infinite-calendar/styles.css'; // Make sure to import the default stylesheet
import { Button } from '@material-ui/core';

class TimeLine extends React.Component {
  constructor(props) {
    super(props);

    const { endDate, startDate } = this.props;

    this.state = {
      timeDiff: moment(endDate).diff(moment(startDate)),
      selectedDate: null,
      dateList: List(),
      activityList: List(),
      offsetX: 0,
      displayEdition: false,
      selectedActivity: null,
    }

    this.toggleSelected = this.toggleSelected.bind(this);
    this.onKeyup = this.onKeyup.bind(this);
    this.toggleNext = this.toggleNext.bind(this);
    this.togglePrev = this.togglePrev.bind(this);
    this.dragLine = this.dragLine.bind(this);
    this.removeDragLine = this.removeDragLine.bind(this);
    this.dragLineMouseMove = this.dragLineMouseMove.bind(this);
    this.setDateList = this.setDateList.bind(this);
    this.deleteDate = this.deleteDate.bind(this);
    this.fetchDates = this.fetchDates.bind(this);
    this.postDate = this.postDate.bind(this);
    this.fetchActivity = this.fetchActivity.bind(this);
    this.toggleDisplayEdition = this.toggleDisplayEdition.bind(this);
    this.selectActivity = this.selectActivity.bind(this);
    this.setActivityList = this.setActivityList.bind(this);
    this.deleteActivity = this.deleteActivity.bind(this);

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
    const width = document.getElementById('line').getBoundingClientRect().width;

    document.addEventListener('keyup', this.onKeyup);
    document.addEventListener('swipeleft', this.togglePrev);
    document.addEventListener('swiperight', this.toggleNext);
    document.addEventListener('mouseup', this.removeDragLine);

    this.setState({ width });

    this.fetchDates();
  }

  fetchActivity() {
    const { selectedActivity } = this.state;

    return fetch('/activity')
      .then(res => res.json())
      .then(activityList => {
        const stateActivityList = List(activityList.map(activity => Map(activity)));
        this.setState({ 
          activityList: stateActivityList,
        });

        if (!selectedActivity) {
          this.selectActivity(stateActivityList.getIn([0, 'id']));
        }
      });
  }

  fetchDates() {
    return fetch('/event')
      .then(res => res.json())
      .then(dateList => {
        this.setState({ 
          dateList: List(dateList.map(date => Map(date))),
        });

        this.fetchActivity();

        // fetch('/event', {
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
    fetch(`/event/${date.get('id')}`, {
      method: 'DELETE',
      body: JSON.stringify({})
    }).then(() => {
      this.fetchDates();
    });
  }

  postDate(date) {
    fetch('/event', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(date)
    });
  }

  postActivity(activity) {
    fetch('/activity', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(activity)
    }).then(() => {
      this.fetchActivity();
    });
  }

  deleteActivity(activity) {
    fetch(`/activity/${activity.get('id')}`, {
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

  selectActivity(activityId) {
    const { dateList } = this.state;

    const filteredDateList = dateList
      .filter(date => date.get('activity').id === activityId)
      .sort(function(a,b){
        return new Date(a.get('date')) - new Date(b.get('date'));
      });

    this.setState(() => ({
      selectedActivity: activityId,
    }), () => {
      this.toggleSelected(filteredDateList.size ? filteredDateList.getIn([0, 'date']) : '');
    });  
  }

  setDateList(path, value) {
    const { dateList, selectedActivity } = this.state;
    
    const filteredDateList = dateList
      .filter(date => date.get('activity').id === selectedActivity)
      .sort(function(a,b){
        return new Date(a.get('date')) - new Date(b.get('date'));
      });

    const dateListIndex = dateList.findIndex(date => date.get('id') === filteredDateList.get(path[0]).get('id'));

    const newDateList = dateList.setIn([dateListIndex, path[1]], value);

    this.setState({
      dateList: newDateList,
      selectedDate: newDateList.getIn([dateListIndex, 'date'])
    })

    this.debouncedPostDate(newDateList.get(dateListIndex));
  }

  onKeyup(event) {
    if (event.which === 37) {
      this.togglePrev();
    } else if (event.which === 39) {
      this.toggleNext();
    }
  }

  togglePrev() {
    const { selectedDate, timeDiff, width, dateList, selectedActivity } = this.state;
    const { startDate } = this.props;

    const orderedDateList = dateList
      .filter(date => date.get('activity').id === selectedActivity)
      .sort(function(a,b){
        return new Date(a.get('date')) - new Date(b.get('date'));
      });

    const index = orderedDateList.findIndex(date => date.get('date') === selectedDate);
    const prevDate = orderedDateList.get(index === 0 ? orderedDateList.size - 1 : index - 1);

    let shift = (document.getElementById('line-wrapper').getBoundingClientRect().width/2);
    if (prevDate.get('endDate')) {
      shift -= ((moment(prevDate.get('endDate')).diff(moment(prevDate.get('date'))) / timeDiff) * width) / 2;
    }

    this.setState({
      selectedDate: prevDate.get('date'),
      offsetX: - ((moment(prevDate.get('date')).diff(moment(startDate)) / timeDiff) * width) + shift
    })
  }

  toggleNext() {
    const { selectedDate, timeDiff, width, dateList, selectedActivity } = this.state;
    const { startDate } = this.props;

    const orderedDateList = dateList
      .filter(date => date.get('activity').id === selectedActivity)
      .sort(function(a,b){
        return new Date(a.get('date')) - new Date(b.get('date'));
      });

    const index = orderedDateList.findIndex(date => date.get('date') === selectedDate);

    const nextDate = orderedDateList.get(index >= orderedDateList.size -1 ? 0 : index + 1);

    let shift = (document.getElementById('line-wrapper').getBoundingClientRect().width/2);
    if (nextDate.get('endDate')) {
      shift -= ((moment(nextDate.get('endDate')).diff(moment(nextDate.get('date'))) / timeDiff) * width) / 2
    }

    this.setState({
      selectedDate: nextDate.get('date'),
      offsetX: - ((moment(nextDate.get('date')).diff(moment(startDate)) / timeDiff) * width) + shift
    })
  }

  toggleSelected(selectedDate) {
    const { timeDiff, width, dateList, selectedActivity } = this.state;
    const { startDate } = this.props;

    const orderedDateList = dateList
      .filter(date => date.get('activity').id === selectedActivity)
      .sort(function(a,b){
        return new Date(a.get('date')) - new Date(b.get('date'));
      });

    const index = orderedDateList.findIndex(date => date.get('date') === selectedDate);

    if (index === -1) {
      return;
    }

    const nextDate = orderedDateList.get(index);

    let shift = (document.getElementById('line-wrapper').getBoundingClientRect().width/2);
    if (nextDate.get('endDate')) {
      shift -= ((moment(nextDate.get('endDate')).diff(moment(nextDate.get('date'))) / timeDiff) * width) / 2
    }

    const offsetX = - ((moment(nextDate.get('date')).diff(moment(startDate)) / timeDiff) * width) + shift;

    this.setState({
      selectedDate,
      offsetX,
    })
  }

  dragLine(event) {
    document.addEventListener('mousemove', this.dragLineMouseMove);
  }

  removeDragLine() {
    document.removeEventListener('mousemove', this.dragLineMouseMove);
  }

  dragLineMouseMove(event) {
    const { offsetX } = this.state;

    this.setState({
      offsetX: offsetX + event.movementX,
    })
  }

  toggleDisplayEdition() {
    const { displayEdition } = this.state;

    this.setState({
      displayEdition: !displayEdition,
    });
  }

  render() {
    const { timeDiff, width, selectedDate, offsetX, dateList, displayEdition, activityList, selectedActivity } = this.state;
    const { startDate, lineHeight, pointSize } = this.props;

    const filteredDateList = dateList
      .filter(date => date.get('activity').id === selectedActivity)
      .sort(function(a,b){
        return new Date(a.get('date')) - new Date(b.get('date'));
      });
    
    return (
      <>
        {activityList.map((activity, index) => (
          <StyledCard className={selectedActivity === activity.get('id') ? 'selected' : ''}>
            <CardActionArea onClick={() => this.selectActivity(activity.get('id'))}>
              <CardMedia
                component="img"
                alt="Sparte"
                height="140"
                image={backgroundMedieval}
                title={activity.get('title')}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  {!displayEdition && activity.get('title')}
                  {displayEdition && <TextField 
                    id="standard-basic" 
                    label="Title" 
                    value={activity.get('title')}
                    onChange={(event) => this.setActivityList([index, 'title'], event.target.value)}
                  />}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {!displayEdition && activity.get('description')}
                  {displayEdition && <TextField 
                    id="standard-basic" 
                    label="Description" 
                    style={{width: 250}}
                    value={activity.get('description')}
                    onChange={(event) => this.setActivityList([index, 'description'], event.target.value)}
                  />}
                </Typography>
                {displayEdition && <DeleteIcon onClick={() => this.deleteActivity(activity)} />}
              </CardContent>
            </CardActionArea>
          </StyledCard>
        ))}
        {displayEdition && <StyledCard>
          <CardActionArea onClick={() => {this.postActivity({title: 'Title', description: 'Description'})}}>
            <CardMedia
              component="img"
              alt="Add"
              height="140"
              image={backgroundMedieval}
              title={'Add'}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                {'Title'}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                {'Description'}
              </Typography>
            </CardContent>
          </CardActionArea>
        </StyledCard>}
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
            type: 'range', innerText: 'event', text: '<p>text</p>', color: 'white', activity: { id: selectedActivity}, background: 'repeating-linear-gradient(45deg, #606dbc, #606dbc 10px, #465298 10px, #465298 20px)', date: moment().format("YYYY-MM-DD HH:mm:ss"), endDate: moment().add(1, 'year').format("YYYY-MM-DD HH:mm:ss")
          })}}
        >
          Add Event
        </Button>}
        <MoveButton>
          <PrevButton onClick={this.togglePrev}>Prev</PrevButton>
          <NextButton onClick={this.toggleNext}>Next</NextButton>
        </MoveButton>
        
        <LineWrapper id="line-wrapper">
          <Line id="line" style={{ height: lineHeight}} onMouseDown={this.dragLine} onMouseUp={this.removeDragLine}/>
          { filteredDateList.map((date, index) => (
            <>
              { date.get('type') === 'point' &&  (
                <StyledCircle
                  circleStyling={{
                    width: pointSize,
                    height: pointSize,
                    backgroundColor: 'red',
                    marginTop: -lineHeight - (pointSize / 2),
                    position: 'absolute',
                    marginLeft: ((moment(date.get('date')).diff(moment(startDate)) / timeDiff) * width) + offsetX,
                    transition: '0.5s all ease',
                    zIndex: 10,
                  }}
                  selected={selectedDate === date.get('date')}
                  onSelected={() => this.toggleSelected(date.get('date'))}
                />
              )}

              { date.get('type') === 'range' &&  (
                <>
                  <RangeElement 
                    className={selectedDate === date.get('date') ? 'selected' : ''}
                    style={{ 
                      marginLeft: ((moment(date.get('date')).diff(moment(startDate)) / timeDiff) * width) + offsetX,
                      width: (moment(date.get('endDate')).diff(moment(date.get('date'))) / timeDiff) * width,
                      background: date.get('background'),
                      color: date.get('color'),
                      position: 'absolute',
                      display: 'block',
                      height: lineHeight,
                      marginTop: -lineHeight - 2,
                      cursor: 'pointer',
                      transition: '0.5s all ease',
                    }}
                    onClick={() => this.toggleSelected(date.get('date'))}
                  >
                    {!!moment(date.get('date')).diff(moment(filteredDateList.get(index - 1).get('endDate'))) && (<RangeDateStart>{moment(date.get('date')).format('YYYY').replace(/^0+/, '')}</RangeDateStart>)}
                    <RangeDateEnd>{moment(date.get('endDate')).format('YYYY').replace(/^0+/, '')}</RangeDateEnd>
                    <RangeText style={{marginTop: 14}}>{date.get('innerText')}</RangeText>
                  </RangeElement>
                </>
              )}
            </>
          ))}
        </LineWrapper>
        <EditorContainer>
          {filteredDateList.map((date, index) => (
            <>
              {selectedDate === date.get('date') &&  (
                <>
                  {displayEdition && (
                    <>
                      <TextField
                        label="Inner text" 
                        value={date.get('innerText')} 
                        onChange={(event) => this.setDateList([index, 'innerText'], event.target.value)} 
                      />
                      <TextField
                        label="Background"
                        style={{width: 800}}
                        value={date.get('background')} 
                        onChange={(event) => this.setDateList([index, 'background'], event.target.value)} 
                      />
                      <DeleteIcon style={{cursor: 'pointer'}} onClick={() => this.deleteDate(date)} />
                      <SelectRangeText><Select
                        value={{value: date.get('activity').id, label: date.get('activity').title}}
                        options={activityList.map(activity => { return {value: activity.get('id'), label: activity.get('title')}})}
                      /></SelectRangeText>
                      <SelectRangeText>
                        <Select
                          defaultValue={{value: date.get('type'), label: date.get('type')}}
                          options={[{value: 'range', label: 'range'}, {value: 'point', label: 'point'}]}
                        />
                      </SelectRangeText>
                      
                      <TwitterPicker
                        triangle='hide'
                        width="100%"
                        color={date.get('color')}
                        onChange={(color) => this.setDateList([index, 'color'], color.hex)}
                        colors={["#f44336", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5", "#2196f3", "#03a9f4", "#00bcd4", "#009688", "#4caf50", "#8bc34a", "#cddc39", "#ffeb3b", "#ffc107", "#ff9800", "#ff5722", "#795548", "#ffffff"]}
                      />
                      <CalendarContainer>
                        <InfiniteCalendar
                          width={250}
                          height={200}
                          selected={new Date(date.get('date'))}
                          min={new Date(-2000, 0, 1)}
                          minDate={new Date(-2000, 0, 1)}
                          display='years'
                          displayOptions={{
                            showMonthsForYears: false,
                            showWeekdays: false,
                            showOverlay: false,
                          }}
                          onSelect={(date) => this.setDateList([index, 'date'], moment(date).format("YYYY-MM-DD HH:mm:ss"))}
                        />
                      </CalendarContainer>
                      {date.get('type') === 'range' && 
                        <CalendarContainer>
                          <InfiniteCalendar
                            width={250}
                            height={200}
                            min={new Date(-2000, 0, 1)}
                            minDate={new Date(-2000, 0, 1)}
                            selected={new Date(date.get('endDate'))}
                            display='years'
                            displayOptions={{
                              showMonthsForYears: false,
                              showWeekdays: false,
                              showOverlay: false,
                            }}
                            onSelect={(date) => this.setDateList([index, 'endDate'], moment(date).format("YYYY-MM-DD HH:mm:ss"))}
                          />
                        </CalendarContainer>
                      }
                    </>
                  )}
                  <ContentDate>
                    <ReactQuill
                      theme="snow" 
                      value={date.get('text')} 
                      onChange={(text) => this.setDateList([index, 'text'], text)}
                      modules={{
                        toolbar: [
                          [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
                          [{ 'align': [] }],
                          [{size: []}],
                          ['bold', 'italic', 'underline', 'strike', 'blockquote',  { 'color': [] }, { 'background': [] }],
                          [{'list': 'ordered'}, {'list': 'bullet'}, 
                          {'indent': '-1'}, {'indent': '+1'}],
                          ['link', 'image', 'video'],
                          [{ 'script': 'sub'}, { 'script': 'super' }],
                          ['clean'],
                          ['code-block']
                        ],
                        clipboard: {
                          // toggle to add extra line breaks when pasting HTML:
                          matchVisual: false,
                        }
                      }}
                    />
                  </ContentDate>
                </>
              )}
            </>
          ))}
        </EditorContainer>
      </>
    );
  }
}

const StyledCard = styled(Card)`
  display: inline-block;
  margin-left: 20px;
  max-width: 300px;

  &.selected {
    color: orange;
  }
`;

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

const CirclePickerContainer = styled.div`
  padding: 10px;
  padding-top: 16px;
`;

const EditorContainer = styled.div`
  padding: 20px;
`;

const StyledCircle = styled(Circle)`
  :after {
    content: '';
    position: absolute;
    width: 1px;
    height: 20px;
    background: black;
    top: -20px;
  }
`;

const RangeElement = styled.div`
  :before {
    content: '';
    position: absolute;
    width: 1px;
    height: 20px;
    background: black;
    top: -20px;
  }
  :after {
    content: '';
    position: absolute;
    width: 1px;
    height: 20px;
    background: black;
    top: -20px;
    right: 0;
  }

  &.selected, :hover {
    box-shadow: inset 0 0 5px white;
  }
`;

const RangeDateStart = styled.div`
  position: absolute;
  top: -50px;
  left: -18px;
  z-index: 10;
  color: black;
`;

const RangeDateEnd = styled.div`
  position: absolute;
  top: -50px;
  right: -18px;
  color: black;
`;

const MoveButton = styled.div`
  margin-left: 10px;

  div {
    margin-top: 53px;
    position: absolute;
    bottom: auto;
    height: 30px;
    width: 30px;
    border-radius: 50%;
    border: 2px solid #fff;
    overflow: hidden;
    color: transparent;
    text-indent: 100%;
    white-space: nowrap;
    -webkit-transition: border-color 0.3s;
    -moz-transition: border-color 0.3s;
    transition: border-color 0.3s;
    cursor: pointer;

    :after {
      content: '';
      position: absolute;
      height: 16px;
      width: 16px;
      top: 50%;
      bottom: auto;
      right: auto;
      background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRw%0D%0AOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjE2cHgiIGhl%0D%0AaWdodD0iMzJweCIgdmlld0JveD0iMCAwIDE2IDMyIj48ZyAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUo%0D%0AMCwgMCkiPjxwb2x5Z29uIGZpbGw9IiM3YjlkNmYiIHBvaW50cz0iNiwxMy40IDQuNiwxMiA4LjYs%0D%0AOCA0LjYsNCA2LDIuNiAxMS40LDggIi8+PC9nPjxnICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLCAx%0D%0ANikiPjxwb2x5Z29uIGZpbGw9IiNkZmRmZGYiIHBvaW50cz0iNiwxMy40IDQuNiwxMiA4LjYsOCA0%0D%0ALjYsNCA2LDIuNiAxMS40LDggIi8+PC9nPjwvc3ZnPg==) no-repeat 0 0;
    }

    :hover {
      border-color: darkgrey;
    }
  }
`;

const NextButton = styled.div`
  right: 10px;
  :after {
    left: 50%;
    -webkit-transform: translateX(-50%) translateY(-50%);
    -moz-transform: translateX(-50%) translateY(-50%);
    -ms-transform: translateX(-50%) translateY(-50%);
    -o-transform: translateX(-50%) translateY(-50%);
    transform: translateX(-50%) translateY(-50%);
  }
`;

const PrevButton = styled.div`
  :after {
    left: 7px;
    -webkit-transform: translateY(-50%) rotate(180deg);
    -moz-transform: translateY(-50%) rotate(180deg);
    -ms-transform: translateY(-50%) rotate(180deg);
    -o-transform: translateY(-50%) rotate(180deg);
    transform: translateY(-50%) rotate(180deg);
  }
`;

const ContentDate = styled.div`
  padding: 10px;
  display: inline-block;
`;

const RangeText = styled.div`
  vertical-align: middle;
  text-align: center;
`;

const LineWrapper = styled.div`
  position: relative;
  margin: 0 60px;
  overflow-x: hidden;
  overflow-y: visible;
  cursor: pointer;
  user-select: none;
  padding-top: 45px;

  &:before {
    left: 0;
    background-image: linear-gradient(to right, #f8f8f8, rgba(248, 248, 248, 0));
    content: '';
    position: absolute;
    z-index: 2;
    top: 0;
    height: 100%;
    width: 20px;
  }

  &:after {
    right: 0;
    background-image: linear-gradient(to left, #f8f8f8, rgba(248, 248, 248, 0));

    content: '';
    position: absolute;
    z-index: 2;
    top: 0;
    height: 100%;
    width: 20px;
  }
`;

const Line = styled.div`
  background: lightblue;
  margin: auto;
  width: 2000px;
  user-select: none;
  border: 2px solid black;
`;

TimeLine.defaultProps = {
  lineHeight: 6,
  pointSize: 20,
};

TimeLine.propTypes = {
  circleStyling: PropTypes.object,
  pointStyling: PropTypes.object,
};



export default TimeLine;