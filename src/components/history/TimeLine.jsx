import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Circle from '../forms/Circle';
import moment from 'moment';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Select from 'react-select'
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

    this.debouncedPostDate = debounce(
      this.postDate.bind(this),
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
    return fetch('/activity')
      .then(res => res.json())
      .then(activityList => {
        const stateActivityList = List(activityList.map(activity => Map(activity)));
        this.setState({ 
          activityList: stateActivityList,
        });

        this.selectActivity(stateActivityList.getIn([0, 'id']));
      });
  }

  fetchDates() {
    const { selectedDate } = this.state;

    return fetch('/event')
      .then(res => res.json())
      .then(dateList => {
        const stateDateList = List(dateList.map(date => Map(date)));
        this.setState({ 
          dateList: stateDateList,
          selectedDate: selectedDate ? selectedDate : stateDateList.getIn([0, 'date'])
        });

        this.fetchActivity();
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

  selectActivity(activityId) {
    const { dateList } = this.state;

    const orderedDateList = dateList.sort(function(a,b){
      return new Date(a.get('date')) - new Date(b.get('date'));
    });

    const filteredDateList = orderedDateList.filter(date => date.get('activity').id === activityId);

    this.setState({
      selectedActivity: activityId,
    });

    this.toggleSelected(filteredDateList.size ? filteredDateList.getIn([0, 'date']) : null)
  }

  setDateList(path, value) {
    const { dateList } = this.state;
    const newDateList = dateList.setIn(path, value);

    this.setState({
      dateList: newDateList,
    })

    this.debouncedPostDate(newDateList.get(path[0]));
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
    const { timeDiff, width, dateList } = this.state;
    const { startDate } = this.props;

    const orderedDateList = dateList
      .sort(function(a,b){
        return new Date(a.get('date')) - new Date(b.get('date'));
      });

    const index = orderedDateList.findIndex(date => date.get('date') === selectedDate);

    const nextDate = orderedDateList.get(index);

    let shift = (document.getElementById('line-wrapper').getBoundingClientRect().width/2);
    if (nextDate.get('endDate')) {
      shift -= ((moment(nextDate.get('endDate')).diff(moment(nextDate.get('date'))) / timeDiff) * width) / 2
    }

    this.setState({
      selectedDate,
      offsetX: - ((moment(nextDate.get('date')).diff(moment(startDate)) / timeDiff) * width) + shift
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
    })
  }

  render() {
    const { timeDiff, width, selectedDate, offsetX, dateList, displayEdition, activityList, selectedActivity } = this.state;
    const { startDate, lineHeight, pointSize } = this.props;

    const orderedDateList = dateList.sort(function(a,b){
      return new Date(a.get('date')) - new Date(b.get('date'));
    });

    const filteredDateList = orderedDateList.filter(date => date.get('activity').id === selectedActivity);
    
    return (
      <>
        {activityList.map(activity => (
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
                  {activity.get('title')}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {activity.get('description')}
                </Typography>
              </CardContent>
            </CardActionArea>
          </StyledCard>
        ))}
        <div><FormControlLabel
          control={<Switch
            checked={displayEdition}
            onChange={this.toggleDisplayEdition}
            name="checkedB"
            color="primary"
          />}
          label="Editer"
        /></div>
        <MoveButton>
          <PrevButton onClick={this.togglePrev}>Prev</PrevButton>
          <NextButton onClick={this.toggleNext}>Next</NextButton>
        </MoveButton>
        
        <LineWrapper id="line-wrapper">
          <Line id="line" style={{ height: lineHeight}} onMouseDown={this.dragLine} onMouseUp={this.removeDragLine}/>
          { filteredDateList.map((date, index) => (
            <>
              { date.get('type') === 'point' && (
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

              { date.get('type') === 'range' && (
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
                    {!!moment(date.get('date')).diff(moment(orderedDateList.get(index - 1).get('endDate'))) && (<RangeDateStart>{moment(date.get('date')).format('YYYY')}</RangeDateStart>)}
                    <RangeDateEnd>{moment(date.get('endDate')).format('YYYY')}</RangeDateEnd>
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
              {selectedDate === date.get('date') && (
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
                      {/* <MuiPickersUtilsProvider utils={DateFnsUtils}><KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="MM/dd/yyyy"
              margin="normal"
              id="date-picker-inline"
              label="Date picker inline"
              value={new Date(date.get('date'))}
              onChange={(date) => this.setDateList([index, 'date'], date)}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            /></MuiPickersUtilsProvider> */}
                      <TwitterPicker
                        triangle='hide'
                        width="100%"
                        color={date.get('color')}
                        onChange={(color) => this.setDateList([index, 'color'], color.hex)}
                        colors={["#f44336", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5", "#2196f3", "#03a9f4", "#00bcd4", "#009688", "#4caf50", "#8bc34a", "#cddc39", "#ffeb3b", "#ffc107", "#ff9800", "#ff5722", "#795548", "#ffffff"]}
                      />
                    </>
                  )}
                  
                  {/* <CalendarContainer><InfiniteCalendar
                    width={150}
                    height={100}
                    selected={new Date(date.get('date'))}
                    disabledDays={[0,6]}
                    display='years'
                    displayOptions={{
                      showHeader: false,
                      showMonthsForYears: false,
                      showWeekdays: false,
                      showOverlay: false,
                    }}
                    onSelect={(date) => setDateList([index, 'date'], date.getFullYear().toString())}
      
                  /></CalendarContainer>
                  {date.get('type') === 'range' && <CalendarContainer><InfiniteCalendar
                    width={150}
                    height={100}
                    selected={new Date(date.get('endDate'))}
                    display='years'
                    displayOptions={{
                      showHeader: false,
                      showMonthsForYears: false,
                      showWeekdays: false,
                      showOverlay: false,
                    }}
                    onSelect={(date) => setDateList([index, 'endDate'], date.getFullYear().toString())}
                    disabledDays={[0,6]}
                  /></CalendarContainer>} */}
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