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

class TimeLine extends React.Component {
  constructor(props) {
    super(props);

    let timeSteps = List();
    for (let index = -5000; index < 2500; index+=100) {
      timeSteps = timeSteps.push(Map({ date: moment(index.toString().padStart(4, '0'), 'YYYY'), isDateBC: index < 0 }));
    }

    this.state = {
      selectedDate: null,
      activityList: List(),
      timeLineCenterX: null,
      displayEdition: false,
      lineHeight: 50,
      zoom: 50000000000,
      timeSteps,
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
    this.getMarginTop = this.getMarginTop.bind(this);
    this.hasSameDates = this.hasSameDates.bind(this);
  }

  getZoom(dateList, timeLineSpan) {
    const smallestSpan = this.getDateSpan(dateList.reduce((curr, prev) =>
      this.getDateSpan(curr) < this.getDateSpan(prev) ? curr : prev
    ));

    return smallestSpan / timeLineSpan * 5;
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

    return this.getDiffDates(this.getTrueDate(date.get('date'), date.get('isDateBC'))) / zoom;
  }

  getDateByPos(pos) {
    const { zoom, timeLineSpan } = this.state;

    return Math.floor(moment().year() - (((pos - (timeLineSpan / 2)) * zoom) / YEAR));
  }

  getWidthByDate(date) {
    const { zoom } = this.state;
    
    return this.getDateSpan(date) / zoom;
  }

  hasSameDates(date, dateToCompare) {
    const { dateList } = this.props;
    const yearStart = this.getStartDate(date).year();
    return dateList.filter(date => 
      yearStart === 
      this.getEndDate(date).year()).size > 0;
  }

  componentDidMount() {
    const timeLineSpan = document.getElementById('line-wrapper').getBoundingClientRect().width;

    document.addEventListener('keyup', this.onKeyup);
    document.addEventListener('swipeleft', () => this.toggleTo('prev'));
    document.addEventListener('swiperight', () => this.toggleTo('next'));
    document.addEventListener('mouseup', this.removeDragLine);

    const { currentYear } = this.props;
    this.setState({ 
      timeLineSpan,
      timeLineCenterX: - this.getPosByDate(Map({'date': moment(Math.abs(currentYear).toString().padStart(4, '0'), 'YYYY'), "isDateBC": currentYear < 0})) + (timeLineSpan / 2),
    });
    console.log(this.getPosByDate(Map({'date': moment(Math.abs(currentYear).toString().padStart(4, '0'), 'YYYY'), "isDateBC": currentYear < 0})), Map({'date': moment(Math.abs(currentYear).toString().padStart(4, '0'), 'YYYY'), "isDateBC": currentYear < 0}));
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

  componentDidUpdate(prevProps ) {
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
    }
    
  }

  dragLine(event) {
    document.addEventListener('mousemove', this.dragLineMouseMove);
  }

  removeDragLine() {
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

  toggleTo(operation) {
    const { selectedDate, timeLineSpan, timeLineCenterX } = this.state;
    const { dateList } = this.props;

    let date = null;
    if (typeof operation === 'string') {
      if (!dateList.size) {
        this.dragLineMouseMove({ movementX: operation === 'next' ? -63 : 63})

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
    if (event.which === 37) {
      this.toggleTo('prev');
    } else if (event.which === 39) {
      this.toggleTo('next');
    }
  }

  render() {
    const { selectedDate, timeLineCenterX, lineHeight, timeSteps } = this.state;
    const { pointSize, classes, dateList, displayHelpers } = this.props;

    return (
      <div>
        <div className={classes.moveButton}>
          <div className={classes.prevButton} onClick={() => this.toggleTo('prev')}>Prev</div>
          <div className={classes.nextButton} onClick={() => this.toggleTo('next')}>Next</div>
        </div>
        <div id="line-wrapper" className={classes.lineWrapper}>
          <div className={classes.line} id="line" style={{ height: lineHeight}} onMouseDown={this.dragLine} onMouseUp={this.removeDragLine}/>
          {displayHelpers && <div
            style={{
              marginTop: -lineHeight - (pointSize / 2) - 10,
              position: 'absolute',
              marginLeft: this.getPosByDate(Map({'date': moment(Math.abs(this.getDateByPos(timeLineCenterX)).toString().padStart(4, '0'), 'YYYY'), "isDateBC": this.getDateByPos(timeLineCenterX) < 0})) + timeLineCenterX,
              zIndex: 100,
            }}
            selected={true}
            onSelected={() => {}}
          >{this.getDateByPos(timeLineCenterX)}</div>}
          {displayHelpers && timeSteps.map((timeStep, index) => (
            <div
              className={classes.timeStep}
              style={{
                marginTop: -lineHeight - (pointSize / 2) + 33,
                position: 'absolute',
                marginLeft: this.getPosByDate(timeStep) + timeLineCenterX,
                zIndex: 0,
              }}
              selected={true}
              onSelected={() => {}}
            >
              {this.getStartDate(timeStep).year()}
            </div>
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
                    marginLeft: this.getPosByDate(date) + timeLineCenterX,
                    transition: '0.5s all ease',
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
                      background: date.get('background'),
                      color: date.get('color'),
                      position: 'absolute',
                      display: 'block',
                      height: 50,
                      marginTop: this.getMarginTop(date),
                      cursor: 'pointer',
                      transition: '0.5s all ease',
                    }}
                    onClick={() => this.toggleTo(date)}
                  >
                    {!this.hasSameDates(date, dateList.get(index - 1)) && 
                      <div className={classes.rangeDateStart}>
                        {this.getStartDate(date).year()}
                      </div>
                    }
                    <div className={classes.rangeDateEnd}>{this.getEndDate(date).year()}</div>
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
    overflow: 'hidden',
    display: 'flex',
    marginLeft: '30px',
    marginRight: '30px',
  },
  lineWrapper: {
    position: 'relative',
    margin: '0 60px',
    overflow: 'hidden',
    clear: 'both',
    cursor: 'pointer',
    userSelect: 'none',
    paddingTop: '45px',

    '&:before': {
      backgroundImage: `linear-gradient(to right, ${theme.backgroundColor}, rgba(248, 248, 248, 0))`,
      left: 0,
      content: '""',
      position: 'absolute',
      zIndex: 2,
      top: 0,
      height: '100%',
      width: '20px',
    },
    '&:after': {
      backgroundImage: `linear-gradient(to left, ${theme.backgroundColor}, rgba(248, 248, 248, 0))`,
      right: 0,
      content: '""',
      position: 'absolute',
      zIndex: 2,
      top: 0,
      height: '100%',
      width: '20px',
    }
  },
  rangeDateStart: {
    position: 'absolute',
    top: '-50px',
    left: '-12px',
    fontSize: '12px',
    zIndex: 10,
    color: theme.color,
  },
  rangeDateEnd: {
    position: 'absolute',
    fontSize: '12px',
    top: '-50px',
    right: '-12px',
    color: theme.color,
  },
  rangeElement: {
    '&:before': {
      content: '""',
      position: 'absolute',
      width: '1px',
      height: '20px',
      background: theme.color,
      top: '-20px',
    },
    '&:after': {
      content: '""',
      position: 'absolute',
      width: '1px',
      height: '20px',
      background: theme.color,
      top: '-20px',
      right: 0,
    },
    '&.selected, &:hover': {
      boxShadow: `inset 0 0 5px ${theme.backgroundColor}`,
    }
  },
  line: {
    background: theme.lineColor,
    margin: 'auto',
    width: '2000px',
    userSelect: 'none',
    border: `2px solid ${theme.color}`,
  },
  rangeText: {
    textAlign: 'center',
    height: '50px',
    position: 'relative',
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
      marginTop: '53px',
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
});

TimeLine.defaultProps = {
  displayHelpers: false,
};

TimeLine.propTypes = {
  displayHelpers: PropTypes.bool,
};

export default withStyles(styles, { withTheme: true })(TimeLine);
