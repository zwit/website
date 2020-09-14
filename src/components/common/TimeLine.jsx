import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Circle from './Circle';
import moment from 'moment';
import 'react-quill/dist/quill.snow.css';
import { withStyles } from "@material-ui/core/styles";
import { Map, List } from 'immutable';
import cx from 'classnames';
import { YEAR } from "../../utils";
import cssGradients from "../../utils/cssGradients";
import { formatMomentDate } from './utils';
import { animated, useSpring } from "react-spring";

class TimeLine extends React.Component {
  constructor(props) {
    super(props);

    let timeSteps = List();
    for (let index = -10000; index <= 2100; index+=100) {
      timeSteps = timeSteps.push(Map({ date: moment(index.toString().padStart(4, '0'), 'YYYY'), isDateBC: index < 0 }));
    }

    let subTimeSteps = List();
    for (let index = -9950; index < 2100; index+=100) {
      subTimeSteps = subTimeSteps.push(Map({ date: moment(index.toString().padStart(4, '0'), 'YYYY'), isDateBC: index < 0 }));
    }

    let tenthTimeSteps = List();
    for (let index = 0; index < 2100; index+=10) {
      if (index % 50) {
        tenthTimeSteps = tenthTimeSteps.push(Map({ date: moment(index.toString().padStart(4, '0'), 'YYYY'), isDateBC: index < 0 }));
      }
    }

    this.state = {
      selectedDate: null,
      activityList: List(),
      timeLineCenterX: null,
      displayEdition: false,
      lineHeight: 50,
      zoom: 50000000000,
      timeSteps,
      subTimeSteps,
      tenthTimeSteps,
      movingTimeout: -1,
    }

    this.toggleSelected = this.toggleSelected.bind(this);
    this.onKeyup = this.onKeyup.bind(this);
    this.toggleTo = this.toggleTo.bind(this);
    this.dragLine = this.dragLine.bind(this);
    this.removeDragLine = this.removeDragLine.bind(this);
    this.dragLineMouseMove = this.dragLineMouseMove.bind(this);
    this.orderDateList = this.orderDateList.bind(this);
    this.getPosByDate = this.getPosByDate.bind(this);
    this.getDateByPos = this.getDateByPos.bind(this);
    this.getWidthByDate = this.getWidthByDate.bind(this);
    this.getSpanByWidth = this.getSpanByWidth.bind(this);
    this.getMarginTop = this.getMarginTop.bind(this);
    this.hasSameDates = this.hasSameDates.bind(this);
    this.startMoving = this.startMoving.bind(this);
    this.stopMoving = this.stopMoving.bind(this);
    this.loop = this.loop.bind(this);
    this.editRange = this.editRange.bind(this);
    this.cancelEditRangeMouseMove = this.cancelEditRangeMouseMove.bind(this);
    this.editRangeMouseMove = this.editRangeMouseMove.bind(this);
  }

  getZoom(dateList, timeLineSpan) {
    const smallestSpan = this.getDateSpan(dateList.reduce((curr, prev) =>
      this.getDateSpan(curr) < this.getDateSpan(prev) ? curr : prev
    ));

    return Math.floor(smallestSpan / timeLineSpan * 5);
  }

  orderDateList(dateList) {
    return dateList
      .map((date) => date.set('date', this.getStartDate(date)))
      .sort(function(a,b) {
        return a.get('date').year() - b.get('date').year();
      })
  }

  getTrueDate(date, isDateBC) {
    const momentDate = moment(date);

    return isDateBC && momentDate.year() > 0 ? 
      momentDate.set('year', -momentDate.year()) : 
      momentDate
    ;
  }

  getDiffDates(date, dateToCompare = moment()) {
    return date.diff(dateToCompare);
  }

  getDateSpan(date) {
    return this.getDiffDates(
      this.getEndDate(date),
      this.getStartDate(date)
    );
  }

  getPosByDate(date) {
    const { zoom } = this.state;

    return (this.getDiffDates(this.getTrueDate(date.get('date'), date.get('isDateBC'))) / zoom);
  }

  getDateByPos(pos) {
    const { zoom, timeLineSpan } = this.state;

    return Math.floor(moment().year() - (((pos - (timeLineSpan / 2)) * zoom) / YEAR));
  }

  getWidthByDate(date) {
    const { zoom } = this.state;
    
    return this.getDateSpan(date) / zoom;
  }

  getSpanByWidth(width) {
    const { zoom } = this.state;
    
    return (width * zoom);
  }

  hasSameDates(date, dateToCompare) {
    const { dateList } = this.props;
    const yearStart = this.getStartDate(date).year();
    return dateList.filter(date => 
      yearStart === 
      this.getEndDate(date).year()).size > 0;
  }

  componentDidMount() {
    const { onDrag } = this.props;
    const timeLineSpan = document.getElementById('line-wrapper').getBoundingClientRect().width;

    document.addEventListener('keydown', this.onKeyup);
    document.addEventListener('keyup', this.stopMoving);
    document.addEventListener('mouseup', this.removeDragLine);

    const { currentYear } = this.props;
    this.setState(() => ({ 
      timeLineSpan,
      timeLineCenterX: - this.getPosByDate(this.craftDateFromYear(currentYear)) + (timeLineSpan / 2),
    }), () => {
      const { timeLineCenterX } = this.state;

      onDrag(this.getDateByPos(timeLineCenterX));
    });
  }

  craftDateFromYear(currentYear) {
    return Map({'date': moment(Math.abs(currentYear).toString().padStart(4, '0'), 'YYYY'), "isDateBC": currentYear < 0});
  }

  getEndDate(date) {
    return this.getTrueDate(date.get('endDate'), date.get('isEndDateBC'));
  }

  getStartDate(date) {
    return this.getTrueDate(date.get('date'), date.get('isDateBC'));
  }

  areDatesOverlapping(date, dateToCompare) {
    return this.getEndDate(date).isAfter(this.getStartDate(dateToCompare)) && this.getStartDate(date).isBefore(this.getStartDate(dateToCompare)) ||
    this.getEndDate(dateToCompare).isAfter(this.getStartDate(date)) && this.getStartDate(dateToCompare).isBefore(this.getStartDate(date));
  }

  getNumberDatesOverlapping(dateCurr, dateList) {
    return dateList
      .filter(date => date.get('id') !== dateCurr.get('id'))
      .filter(date => this.areDatesOverlapping(date, dateCurr))
      .size
    ;
  }

  getLineHeight(dateList) {
    const lineHeight =  50 + 50 * dateList.reduce((maxNbOverlap, date) => {
      return this.getNumberDatesOverlapping(date, dateList) > maxNbOverlap;
    });

    return lineHeight;
  }

  componentDidUpdate(prevProps) {
    const { dateList, currentYear } = this.props;
    const { selectedDate, timeLineSpan } = this.state;

    const isSelectedDateNotFound = dateList.size && (!selectedDate || !dateList.filter((date) => date.get('id') === selectedDate.get('id')).size);
    const hasDateListAndSelectedDate = dateList.size && prevProps.dateList.size && selectedDate;
    const currentSelectedDate = hasDateListAndSelectedDate && dateList.find((date) => date.get('id') === selectedDate.get('id'));
    const prevSelectedDate = hasDateListAndSelectedDate && prevProps.dateList.find((date) => date.get('id') === selectedDate.get('id'));
    const hasEndDateChanged = currentSelectedDate && currentSelectedDate && currentSelectedDate.get('endDate') !== prevSelectedDate.get('endDate');
    const hasStartDateChanged = currentSelectedDate && currentSelectedDate && currentSelectedDate.get('date') !== prevSelectedDate.get('date');

    if (dateList.size) {
      if (isSelectedDateNotFound || hasEndDateChanged || hasStartDateChanged) {
        this.setState(() => ({ 
          zoom: this.getZoom(dateList, timeLineSpan),
          lineHeight: this.getLineHeight(dateList),
        }), () => {
          const selectedDate = currentYear && dateList.find(date => 
            this.getTrueDate(date.get('date'), date.get('isDateBC')).year() < currentYear &&
            this.getTrueDate(date.get('endDate'), date.get('isEndDateBC')).year() > currentYear
          );
          return selectedDate ? this.toggleTo(selectedDate) : this.toggleTo(dateList.get(0));
        })
      }
    } else if (!dateList.size && prevProps.dateList.size) {
      this.setState(() => ({ 
        zoom: 50000000000,
        selectedDate: null,
      }), () => {
        this.setState({
          timeLineCenterX: - this.getPosByDate(this.craftDateFromYear(currentYear)) + (timeLineSpan / 2)
        });
      })
    }
  }

  dragLine(event) {
    this.setState({
      isDragging: true,
    });

    document.addEventListener('mousemove', this.dragLineMouseMove);
  }

  removeDragLine() {
    this.setState({
      isDragging: false,
    });

    document.removeEventListener('mousemove', this.dragLineMouseMove);
  }

  dragLineMouseMove(event) {
    const { timeLineCenterX } = this.state;
    const { onDrag } = this.props;

    this.setState({
      timeLineCenterX: timeLineCenterX + event.movementX,
    });

    onDrag(this.getDateByPos(timeLineCenterX + event.movementX));
  }

  getMarginTop(date) {
    const { lineHeight } = this.state;
    const { dateList } = this.props;

    return lineHeight > 50 ? -lineHeight - 2 + ((this.getNumberDatesOverlapping(date, dateList)-1) * 50) : -lineHeight - 2;
  }

  toggleSelected(selectedDate) {
    const { timeLineSpan } = this.state;
    const { setSelectedDate, onDrag } = this.props;

    let shift = timeLineSpan / 2;
    if (selectedDate.get('endDate')) {
      shift -= this.getWidthByDate(selectedDate) / 2
    }

    const timeLineCenterX = - this.getPosByDate(selectedDate) + shift;

    this.setState({
      selectedDate,
      timeLineCenterX,
    });

    onDrag(this.getDateByPos(timeLineCenterX));

    setSelectedDate(selectedDate);
  }

  toggleTo(operation, step = 63) {
    const { selectedDate, timeLineSpan } = this.state;
    const { dateList } = this.props;

    let date = null;
    if (typeof operation === 'string') {
      if (!dateList.size) {
        this.dragLineMouseMove({ movementX: operation === 'next' ? -step : step})

        return;
      }
      const orderedList = this.orderDateList(dateList);

      const index = orderedList.findIndex(date => date.get('id') === selectedDate.get('id'));

      let newIndex = index === 0 ? dateList.size - 1 : index - 1;
      if (operation === 'next') {
        newIndex = index >= dateList.size -1 ? 0 : index + 1;
      }

      date = orderedList.get(newIndex);
    } else {
      date = operation;
    }
    
    const dateSpan = this.getWidthByDate(date);

    const isDateSpanWiderThanTimeLine = dateSpan > timeLineSpan;
    if (isDateSpanWiderThanTimeLine) {
      return this.setState(() => ({
        zoom: this.getZoom(List([date]), timeLineSpan * 3),
      }), () => {
        this.toggleSelected(date);
      });
    } else if (dateSpan / timeLineSpan < 0.2) {
      return this.setState(() => ({
        zoom: this.getZoom(dateList, timeLineSpan),
      }), () => {
        this.toggleSelected(date);
      });
    }

    return this.toggleSelected(date);
  }

  onKeyup(event) {
    if (event.which === 37 || (event.shiftKey && event.keyCode == 9)) {
        this.startMoving('prev');
    } else if (event.which === 39 || event.which === 8) {
        this.startMoving('next');
    }
  }

  stopMoving() {
    const { movingTimeout } = this.state;

    clearTimeout(movingTimeout);
    this.setState({ movingTimeout: -1 });
  }

  startMoving(direction) {
    const { movingTimeout } = this.state;

    if (movingTimeout === -1) {      
      this.loop(direction);
    }
  }

  loop(direction) {
    const { selectedDate } = this.state;

    this.toggleTo(direction, 10);
    this.setState({ movingTimeout: setTimeout(this.loop, selectedDate ? 700 : 70, direction) });
  }

  editRange(date, accessor) {
    const { editMode } = this.props;

    if (!editMode) {
      return;
    }

    document.addEventListener('mousemove', (event) => this.editRangeMouseMove(date, accessor, event));
  }

  editRangeMouseMove(date, accessor, event) {
    const { postDate } = this.props;

    this.setState({
      isDragging: true,
    });

    postDate(accessor, formatMomentDate(moment(date.get(accessor)).add(this.getSpanByWidth(event.movementX))));
  }

  cancelEditRangeMouseMove() {
    document.removeEventListener('mousemove', this.editRangeMouseMove);
  }

  render() {
    const { selectedDate, timeLineCenterX, lineHeight, timeSteps, subTimeSteps, isDragging, zoom, tenthTimeSteps } = this.state;
    const { pointSize, classes, dateList, displayHelpers } = this.props;

    const isSmallZoom = zoom < 30000000000;

    return (
      <div>
        <div className={classes.moveButton}>
          <div className={classes.prevButton} onClick={() => this.toggleTo('prev')}>Prev</div>
          <div className={classes.nextButton} onClick={() => this.toggleTo('next')}>Next</div>
        </div>
        {displayHelpers && !selectedDate && <div
          className={cx(classes.tooltipContainer)}
          selected={true}
          onSelected={() => {}}
        >
          <div className={cx(classes.rangeDate, classes.tooltip)}>
            {this.getDateByPos(timeLineCenterX)}
          </div>
        </div>}
        <div id="line-wrapper" className={classes.lineWrapper}>
          <div className={classes.line} id="line" style={{ height: lineHeight}} onMouseDown={this.dragLine} onMouseUp={this.removeDragLine} onClick={(e) => console.log(e)} />
          {displayHelpers && timeSteps.map((timeStep, index) => (
            <div
              className={classes.timeStep}
              style={{
                marginTop: -lineHeight - (pointSize / 2) + 33,
                position: 'absolute',
                marginLeft: this.getPosByDate(timeStep) + timeLineCenterX - 18,
                zIndex: -1,
                transition: selectedDate && !isDragging ? '0.5s all ease' : '0s all ease',
              }}
              selected={true}
              onSelected={() => {}}
            >
              <div className={classes.timeStepContainer}><div className={classes.timeStepInner}>{this.getStartDate(timeStep).year()}</div></div>
            </div>
          ))}
          {displayHelpers && subTimeSteps.map((subTimeStep, index) => (
            <div
              className={isSmallZoom ? classes.timeStep : classes.subTimeStep}
              style={{
                marginTop: -lineHeight - (pointSize / 2) + 33,
                position: 'absolute',
                marginLeft: this.getPosByDate(subTimeStep) + timeLineCenterX - 15,
                zIndex: 0,
                transition: selectedDate && !isDragging ? '0.5s all ease' : '0s all ease',
              }}
              selected={true}
              onSelected={() => {}}
            >
              {isSmallZoom && <div className={classes.timeStepContainer}><div className={classes.timeStepInner}>{this.getStartDate(subTimeStep).year()}</div></div>}
            </div>
          ))}
          {displayHelpers && isSmallZoom && tenthTimeSteps.map((tenthTimeStep, index) => (
            <div
              className={classes.subTimeStep}
              style={{
                marginTop: -lineHeight - (pointSize / 2) + 33,
                position: 'absolute',
                marginLeft: this.getPosByDate(tenthTimeStep) + timeLineCenterX - 15,
                zIndex: 0,
                transition: selectedDate && !isDragging ? '0.5s all ease' : '0s all ease',
              }}
              selected={true}
              onSelected={() => {}}
            />
          ))}
          { dateList.map((date, index) => (
            <>
              { date.get('type') === 'point' &&  (
                <div
                  className={classes.styledCircle}
                  circleStyling={{
                    width: pointSize,
                    height: pointSize,
                    backgroundColor: 'red',
                    marginTop: -lineHeight - (pointSize / 2),
                    position: 'absolute',
                    marginLeft: this.getPosByDate(date) + timeLineCenterX - 18,
                    transition: isDragging ? '0s all ease' : '0.5s all ease',
                    zIndex: 10,
                  }}
                  selected={selectedDate && selectedDate.get('id') === date.get('id')}
                  onSelected={() => this.toggleTo(date)}
                />
              )}
              { date.get('type') === 'range' && (
                <>
                  <div 
                    className={cx(classes.rangeElement, {'selected': selectedDate && selectedDate.get('id') === date.get('id')})}
                    style={{ 
                      marginLeft: this.getPosByDate(date) + timeLineCenterX,
                      width: this.getWidthByDate(date),
                      ...cssGradients[Math.floor((Math.random() * (cssGradients.length - 1)))].css,
                      textShadow: '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black',
                      //Math.floor((index % (cssGradients.length - 1)))
                      //Math.floor((Math.random() * (cssGradients.length - 1)))
                      // background: date.get('background'),
                      color: date.get('color'),
                      position: 'absolute',
                      display: 'block',
                      height: 50,
                      marginTop: this.getMarginTop(date),
                      cursor: 'pointer',
                      transition: isDragging ? '0s all ease' : '0.5s all ease',
                    }}
                    onClick={() => this.toggleTo(date)}
                  >
                    {!this.hasSameDates(date, dateList.get(index - 1)) && 
                      <div
                        onMouseDown={() => this.editRange(date, 'date')}
                        onMouseUp={this.cancelEditRangeMouseMove}
                        className={cx(classes.rangeDateContainer, classes.rangeDateStartContainer)}
                      >
                        <div className={cx(classes.rangeDateStart, classes.rangeDate)}>
                          {this.getStartDate(date).year()}
                        </div>
                      </div>
                    }
                    <div
                      onMouseDown={() => this.editRange(date, 'endDate')}
                      onMouseUp={this.cancelEditRangeMouseMove}
                      className={cx(classes.rangeDateContainer, classes.rangeDateEndContainer)}
                    >
                      <div className={cx(classes.rangeDateEnd, classes.rangeDate)}>{this.getEndDate(date).year()}</div>
                    </div>
                    <div className={classes.rangeText}><div className={classes.rangeTextInner}>{date.get('innerText')}</div></div>
                  </div>
                </>
              )}
            </>
          ))}
        </div>
      </div>
    );
  }
}

const styles = theme => ({
  slider: {
    overflowX: 'hidden',
    overflowY: 'visible',
    display: 'flex',
    marginLeft: '30px',
    marginRight: '30px',
  },
  lineWrapper: {
    background: theme.lineColor,
    position: 'relative',
    overflowX: 'hidden',
    overflowY: 'visible',
    clear: 'both',
    cursor: 'pointer',
    userSelect: 'none',
    zIndex: 0,

    '&:before': {
      backgroundImage: `linear-gradient(to right, ${theme.backgroundColor}, rgba(248, 248, 248, 0))`,
      left: 0,
      content: '""',
      position: 'absolute',
      zIndex: 2,
      top: 0,
      height: '100%',
      width: '50px',
    },
    '&:after': {
      backgroundImage: `linear-gradient(to left, ${theme.backgroundColor}, rgba(248, 248, 248, 0))`,
      right: 0,
      content: '""',
      position: 'absolute',
      zIndex: 2,
      top: 0,
      height: '100%',
      width: '50px',
    }
  },
  rangeDateStartContainer: {
    left: -25,
  },
  rangeDateEndContainer: {
    right: -25,
  },
  rangeDateContainer: {
    width: 50,
    position: 'absolute',
    top: 16,
    zIndex: 1,

    '&:hover': {
      zIndex: 12,
    }
  },
  rangeDate: {
    top: 16,
    fontSize: '12px',
    zIndex: 10,
    color: 'white',
    backgroundColor: 'black',
    padding: 3,
    borderRadius: 5,
    border: '1px solid white',
    boxShadow: '0px 0px 15px 1px rgba(0, 0, 0, 0.7)',
    lineHeight: '100%',
    display: 'table',
    margin: '0 auto',
  },
  rangeDateStart: {
    left: -16,
  },
  rangeDateEnd: {
    right: -16,
  },
  rangeElement: {
    '&:before': {
      content: '""',
      position: 'absolute',
      width: '1px',
      height: 50,
      background: 'white',
      top: 0,
    },
    '&:after': {
      content: '""',
      position: 'absolute',
      width: '1px',
      height: 50,
      background: 'white',
      top: 0,
      right: 0,
    },
    '&.selected, &:hover': {
      boxShadow: `inset 0 0 5px ${theme.backgroundColor}`,
    }
  },
  line: {
    zIndex: 100,
    margin: 'auto',
    width: '2000px',
    userSelect: 'none',
    border: `2px solid ${theme.color}`,
  },
  rangeText: {
    textAlign: 'center',
    height: '50px',
    position: 'relative',
    cursor: 'pointer',
  },
  rangeTextInner: {
    margin: 0,
    position: 'absolute',
    top: '50%',
    left: '50%',
    msTransform: 'translate(-50%, -50%)',
    transform: 'translate(-50%, -50%)',
    width: 'fit-content',
  },
  nextButton: {
    backgroundColor: 'black',
    zIndex: 20,
    right: '10px',
    '&:after': {
      left: '50%',
      webkitTransform: 'translateX(-50%) translateY(-50%)',
      mozTransform: 'translateX(-50%) translateY(-50%)',
      msTransform: 'translateX(-50%) translateY(-50%)',
      oTransform: 'translateX(-50%) translateY(-50%)',
      transform: 'translateX(-50%) translateY(-50%)',
    },
  },
  prevButton: {
    backgroundColor: 'black',
    zIndex: 20,
    '&:after': {
      left: '7px',
      webkitTransform: 'translateY(-50%) rotate(180deg)',
      mozTransform: 'translateY(-50%) rotate(180deg)',
      msTransform: 'translateY(-50%) rotate(180deg)',
      oTransform: 'translateY(-50%) rotate(180deg)',
      transform: 'translateY(-50%) rotate(180deg)',
    },
  },
  moveButton: {
    marginLeft: '10px',

    '& div': {
      marginTop: '10px',
      position: 'absolute',
      bottom: 'auto',
      height: '30px',
      width: '30px',
      borderRadius: '50%',
      border: '2px solid #fff',
      overflow: 'hidden',
      color: 'transparent',
      textIndent: '100%',
      whiteSpace: 'nowrap',
      webkitTransition: 'border-color 0.3s',
      mozTransition: 'border-color 0.3s',
      transition: 'border-color 0.3s',
      cursor: 'pointer',

    '&:after': {
      content: '""',
      position: 'absolute',
      height: '16px',
      width: '16px',
      top: '50%',
      bottom: 'auto',
      right: 'auto',
      background: 'url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRw%0D%0AOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjE2cHgiIGhl%0D%0AaWdodD0iMzJweCIgdmlld0JveD0iMCAwIDE2IDMyIj48ZyAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUo%0D%0AMCwgMCkiPjxwb2x5Z29uIGZpbGw9IiM3YjlkNmYiIHBvaW50cz0iNiwxMy40IDQuNiwxMiA4LjYs%0D%0AOCA0LjYsNCA2LDIuNiAxMS40LDggIi8+PC9nPjxnICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLCAx%0D%0ANikiPjxwb2x5Z29uIGZpbGw9IiNkZmRmZGYiIHBvaW50cz0iNiwxMy40IDQuNiwxMiA4LjYsOCA0%0D%0ALjYsNCA2LDIuNiAxMS40LDggIi8+PC9nPjwvc3ZnPg==) no-repeat 0 0',
    },

    '&:hover': {
      borderColor: 'darkgrey',
    }
  }
  },
  timeStep: {
    '&:after': {
      content: '""',
      position: 'absolute',
      width: '1px',
      height: '20px',
      background: theme.color,
      top: '-25px',
      left: '19px',
    },
  },
  subTimeStep: {
    '&:after': {
      content: '""',
      position: 'absolute',
      width: '1px',
      height: '10px',
      background: theme.color,
      top: '-25px',
      left: '16px',
    },
  },
  styledCircle: {
    '&:after': {
      content: '""',
      position: 'absolute',
      width: '1px',
      height: '20px',
      background: 'black',
      top: '-20px',
    },
  },
  timeStepContainer: {
    width: 50,
    marginLeft: -5,
  },
  timeStepInner: {
    margin: '0 auto',
    display: 'table',
  },
  tooltipContainer: {
    width: 50,
    position: 'absolute',
    marginLeft: 'auto',
    marginRight: 'auto',
    left: 0,
    right: 0,
    zIndex: 1,
    top: -10,

    '&:hover': {
      zIndex: 12,
    }
  },
  tooltip: {
    // zIndex: 100,
    // left: 0,
    // right: 0,
    // top: -45,
    // marginLeft: 'auto',
    // marginRight: 'auto',
    // textAlign: 'center',

    // width: '33px',
    // height: '34px',
    // borderRadius: '5px',
    // position: 'absolute',
    // background: '#fff',
    // zIndex: 2,
    // padding: '0 15px',
    // boxShadow: '0 10px 30px rgba(#414856, 0.05)',
    // display: 'flex',
    // justifyContent: 'space-around',
    // alignItems: 'center',
    // transition: 'opacity .15s ease-in, top .15s ease-in, width .15s ease-in',

    // '&:after': {
    //   content: '""',
    //   width: '20px',
    //   height: '20px',
    //   background: '#fff',
    //   borderRadius: '3px',
    //   position: 'absolute',
    //   left: '50%',
    //   marginLeft: '-10px',
    //   bottom: '-8px',
    //   transform: 'rotate(45deg)',
    //   zIndex: -1,
    // }
  },
});

TimeLine.defaultProps = {
  displayHelpers: false,
};

TimeLine.propTypes = {
  displayHelpers: PropTypes.bool,
  editMode: PropTypes.bool.isRequired,
};

export default withStyles(styles, { withTheme: true })(TimeLine);
