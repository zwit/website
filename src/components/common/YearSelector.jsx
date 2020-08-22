import React, { useState } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from "@material-ui/core/styles";
import { TextField } from '@material-ui/core';
import './Slider.scss';

class YearSelector extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filterDate: '',
      scrollTop: 0,
      optionSize: 50,
      buffer: [],
    };

    this.setFilterDate = this.setFilterDate.bind(this);
    this.onScroll = this.onScroll.bind(this);
  }

  componentDidMount() {
    const { buffer, optionSize, scrollTop } = this.state;
    const { classes, options, defaultValue, onSelect } = this.props;

    let newBuffer = buffer;
    const newScrollTop = options.findIndex((year, index) => defaultValue === year.value);

    options
      .filter((year, index) => index - 8 < newScrollTop && index + 3 > newScrollTop)
      .forEach((year, index) => {
        newBuffer.push(<div index={index} onClick={() => onSelect(year.value)} className={cx(classes.option, {
          'selected': defaultValue === year.value,
          })} style={{top: `${index * optionSize}px`}}>
          {year.label}
        </div>)
    });

    this.setState({
      buffer: newBuffer,
      scrollTop: newScrollTop
    });
  }

  componentDidUpdate(prevProps) {
    const { defaultValue } = this.props;
    const { scrollTop } = this.state;

    if (prevProps.defaultValue !== defaultValue) {
      this.onScroll(scrollTop, true);
    }
  }

  setFilterDate(filterDate) {
    this.setState(() => ({
      filterDate,
    }), () => {
      this.onScroll(0, true);
    });
  }

  onScroll(targetScrollTop, forceUpdate = false) {
    const { scrollTop, optionSize, buffer, filterDate } = this.state;
    const { classes, onSelect, defaultValue, options } = this.props;

    const newScrollTop = Math.floor(targetScrollTop / optionSize);

    if (scrollTop !== newScrollTop || forceUpdate) {
      const filteredOptions = options
        .filter(year => filterDate === '' || !!year.value.toString().match(RegExp(filterDate)));
      let newBuffer = buffer;

      if (forceUpdate) {
        newBuffer = [];
        filteredOptions
          .map((year, index) => {
            if (index - 13 < scrollTop && index + 8 > scrollTop) {
            return newBuffer.push(<div index={index} onClick={() => onSelect(year.value)} className={cx(classes.option, {
            'selected': defaultValue === year.value,
            })} style={{top: `${index * optionSize}px`}}>
            {year.label}
          </div>)}
          })
      } else {
        if (scrollTop < newScrollTop) {
          const newIndex = scrollTop + 8;
  
          for (let i
             = 0; 
            i < newScrollTop - scrollTop; 
            i++) {
              if (filteredOptions[newIndex + i]) {
              newBuffer.push(<div index={newIndex + i} onClick={() => onSelect(filteredOptions[newIndex - i].value)} className={cx(classes.option, {
                'selected': defaultValue === filteredOptions[newIndex + i].value,
                })} style={{top: `${(newIndex + i) * optionSize}px`}}>
                {filteredOptions[newIndex + i].label}
              </div>);
              newBuffer.shift();
            }
          }
        } else {
          const newIndex = scrollTop;
          for (let i
            = 0; 
           i < scrollTop - newScrollTop; 
           i++) {
            if (filteredOptions[newIndex - i]) {
              newBuffer.unshift(<div index={newIndex - i} onClick={() => onSelect(filteredOptions[newIndex - i].value)} className={cx(classes.option, {
                'selected': defaultValue === filteredOptions[newIndex - i].value,
                })} style={{top: `${(newIndex - i) * optionSize}px`}}>
                {filteredOptions[newIndex - i].label}
              </div>);
              newBuffer.pop();
            }
          }
        }
      }

      this.setState({
        scrollTop: newScrollTop,
        buffer: newBuffer,
      });
    }
  }

  render() {
    const { filterDate, optionSize, buffer } = this.state;
    const { classes, options } = this.props;

    const filteredOptions = options
      .filter(year => filterDate === '' || !!year.value.toString().match(RegExp(filterDate)))
    ;

    return (
      <>
        <div className={classes.root}>
          <div className={classes.header}>
            <TextField 
              id="standard-basic"
              label="Year"
              type="number"
              value={filterDate} 
              onChange={(event) => this.setFilterDate(event.target.value)} 
            />
          </div>
          <div 
            className={classes.content} 
            onScroll={(event) => this.onScroll(event.target.scrollTop)}
          >
            <div 
              style={{height: `${filteredOptions.length * optionSize}px`}} 
              className={classes.groupOption}
            >
              {buffer}
            </div>  
          </div>
        </div>
      </>
    )
  }
}

const styles = theme => ({
  root: {
    color: 'rgb(51, 51, 51)',
    width: '250px',
  },
  header: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
    overflow: 'hidden',
    minHeight: '98px',
    padding: '20px',
    lineHeight: 1.3,
    fontWeight: 400,
    borderTopLeftRadius: '3px',
    borderTopRightRadius: '3px',
    backgroundColor: 'rgb(68, 138, 255)',
    color: 'rgb(255, 255, 255)',
  },
  content: {
    overflow: 'auto',
    willChange: 'transform',
    height: '250px',
    width: '250px',
    backgroundColor: '#F9F9F9',
  },
  groupOption: {
    width: 250,
    height: 200,
    position: 'relative',
    width: '100%',
    minHeight: '100%',
  }, option: {
    height: 50,
    display: 'flex',
    padding: '0 20px',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontWeight: 500,
    textAlign: 'center',
    cursor: 'pointer',
    webkitUserSelect: 'none',
    boxSizing: 'border-box',
    position: 'absolute',
    left: '0px',
    width: '100%',
    height: '50px',
    color: 'black',

    '&.selected': {
      color: 'rgb(85, 159, 255)',
      fontSize: 25,
    },
    
    '&:hover': {
      color: 'rgb(85, 159, 255)',
    }
  }, slider: {
    display: 'flex',
    overflowX: 'scroll',
    width: '100%',
    paddingBottom: '20px',
    marginBottom: '-20px',

    '&::after': {
      right: '0',
      backgroundImage: 'linear-gradient(to left,#f8f8f8,rgba(248,248,248,0))',
      content: '""',
      position: 'absolute',
      zIndex: '2',
      height: '345px',
      width: '70px',
    },

    '&::before': {
      left: '0',
      backgroundImage: 'linear-gradient(to right,#f8f8f8,rgba(248,248,248,0))',
      content: '""',
      position: 'absolute',
      zIndex: '2',
      height: '345px',
      width: '70px',
    }
  },
});

YearSelector.propTypes = {
  entityList: PropTypes.string.isRequired,
  selectEntity: PropTypes.func.isRequired,
  deleteEntity: PropTypes.func.isRequired,
  postEntity: PropTypes.func.isRequired,
};

export default withStyles(styles, { withTheme: true })(YearSelector);
