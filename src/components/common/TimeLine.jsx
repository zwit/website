import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Circle from '../forms/Circle';
import moment from 'moment';
import 'react-quill/dist/quill.snow.css';
import { withStyles } from "@material-ui/core/styles";
import { Map, List } from 'immutable';
import 'react-infinite-calendar/styles.css'; // Make sure to import the default stylesheet

class TimeLine extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedDate: null,
      activityList: List(),
      timeLineCenterX: 0,
      displayEdition: false,
    }

    this.toggleSelected = this.toggleSelected.bind(this);
    this.onKeyup = this.onKeyup.bind(this);
    this.toggleTo = this.toggleTo.bind(this);
    this.dragLine = this.dragLine.bind(this);
    this.removeDragLine = this.removeDragLine.bind(this);
    this.dragLineMouseMove = this.dragLineMouseMove.bind(this);
    this.orderDateList = this.orderDateList.bind(this);
    this.getPosByDate = this.getPosByDate.bind(this);
    this.getWidthByDate = this.getWidthByDate.bind(this);
  }

  getZoom(dateList, timeLineSpan) {
    const smallestSpan = this.getDateSpan(dateList.reduce((curr, prev) =>
      this.getDateSpan(curr) < this.getDateSpan(prev) ? curr : prev
    ));

    return smallestSpan / timeLineSpan * 10;
  }

  orderDateList(dateList) {
    return dateList
      .map((date) => date.set('date', this.getTrueDate(date.get('date'), date.get('isDateBC'))))
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
      this.getTrueDate(date.get('endDate'), date.get('isEndDateBC')), 
      this.getTrueDate(date.get('date'), date.get('isDateBC'))
    );
  }

  getPosByDate(date) {
    const { zoom } = this.state;

    return this.getDiffDates(this.getTrueDate(date.get('date'), date.get('isDateBC'))) / zoom;
  }

  getWidthByDate(date) {
    const { zoom } = this.state;
    
    return this.getDateSpan(date) / zoom;
  }

  hasSameDates(date, dateToCompare) {
    return this.getDiffDates(
      this.getTrueDate(date.get('date'), date.get('isDateBC')),
      this.getTrueDate(dateToCompare.get('endDate'), dateToCompare.get('isEndDateBC'))
    ) === 0;
  }

  componentDidMount() {
    const timeLineSpan = document.getElementById('line-wrapper').getBoundingClientRect().width;

    document.addEventListener('keyup', this.onKeyup);
    document.addEventListener('swipeleft', () => this.toggleTo('prev'));
    document.addEventListener('swiperight', () => this.toggleTo('next'));
    document.addEventListener('mouseup', this.removeDragLine);

    this.setState({ timeLineSpan });
  }

  componentDidUpdate() {
    const { dateList } = this.props;
    const { selectedDate, timeLineSpan } = this.state;

    if (dateList.size && (!selectedDate || !dateList.filter((date) => date.get('id') === selectedDate.get('id')).size)) {
      this.setState(() => ({ 
        zoom: this.getZoom(dateList, timeLineSpan)
      }), () => {
        this.toggleSelected(dateList.get(0));
      })
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

    this.setState({
      timeLineCenterX: timeLineCenterX + event.movementX,
    })
  }

  toggleSelected(selectedDate) {
    const { timeLineSpan } = this.state;
    const { setSelectedDate } = this.props;

    let shift = timeLineSpan / 2;
    if (selectedDate.get('endDate')) {
      shift -= this.getWidthByDate(selectedDate) / 2
    }

    const timeLineCenterX = - this.getPosByDate(selectedDate) + shift;

    this.setState({
      selectedDate,
      timeLineCenterX,
    });

    setSelectedDate(selectedDate);
  }

  toggleTo(operation) {
    const { selectedDate } = this.state;
    const { dateList } = this.props;

    const orderedList = this.orderDateList(dateList);

    const index = orderedList.findIndex(date => date.get('id') === selectedDate.get('id'));

    let newIndex = index === 0 ? dateList.size - 1 : index - 1;
    if (operation === 'next') {
      newIndex = index >= dateList.size -1 ? 0 : index + 1;
    }

    return this.toggleSelected(orderedList.get(newIndex));
  }

  onKeyup(event) {
    if (event.which === 37) {
      this.toggleTo('prev');
    } else if (event.which === 39) {
      this.toggleTo('next');
    }
  }

  render() {
    const { selectedDate, timeLineCenterX } = this.state;
    const { lineHeight, pointSize, classes, dateList } = this.props;

    return (
      <div>
        <MoveButton>
          <PrevButton onClick={() => this.toggleTo('prev')}>Prev</PrevButton>
          <NextButton onClick={() => this.toggleTo('next')}>Next</NextButton>
        </MoveButton>
        <LineWrapper id="line-wrapper">
          <Line id="line" style={{ height: lineHeight}} onMouseDown={this.dragLine} onMouseUp={this.removeDragLine}/>
          { dateList.map((date, index) => (
            <>
              { date.get('type') === 'point' &&  (
                <StyledCircle
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
                  onSelected={() => this.toggleSelected(date)}
                />
              )}

              { date.get('type') === 'range' && (
                <>
                  <RangeElement 
                    className={selectedDate && selectedDate.get('id') === date.get('id') ? 'selected' : ''}
                    style={{ 
                      marginLeft: this.getPosByDate(date) + timeLineCenterX,
                      width: this.getWidthByDate(date),
                      background: date.get('background'),
                      color: date.get('color'),
                      position: 'absolute',
                      display: 'block',
                      height: lineHeight,
                      marginTop: -lineHeight - 2,
                      cursor: 'pointer',
                      transition: '0.5s all ease',
                    }}
                    onClick={() => this.toggleSelected(date)}
                  >
                    {!this.hasSameDates(date, dateList.get(index - 1)) && 
                      <RangeDateStart>
                        {this.getTrueDate(date.get('date'), date.get('isDateBC')).year()}
                      </RangeDateStart>
                    }
                    <RangeDateEnd>{this.getTrueDate(date.get('endDate'), date.get('isEndDateBC')).year()}</RangeDateEnd>
                    <RangeText><RangeTextInner>{date.get('innerText')}</RangeTextInner></RangeText>
                  </RangeElement>
                </>
              )}
            </>
          ))}
        </LineWrapper>
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
});

const LineWrapper = styled.div`
  position: relative;
  margin: 0 60px;
  overflow: hidden;
  clear: both;
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

const RangeText = styled.div`
  text-align: center;

  height: 50px;
  position: relative;
`;

const RangeTextInner = styled.div`
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  width: fit-content;
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

TimeLine.propTypes = {
};

export default withStyles(styles, { withTheme: true })(TimeLine);
