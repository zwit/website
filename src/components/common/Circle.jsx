import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

function Circle({circleStyling, pointStyling, selected, onSelected}) {
  
  return (
    <>
      <CircleElement style={{...circleStyling}} onClick={onSelected}>
        <Point style={{...pointStyling, display: selected ? 'none' : 'block'}}/>
      </CircleElement>
    </>
  );
}

Circle.defaultProps = {
  circleStyling: {
    width: 20,
    height: 20,
    backgroundColor: 'red'
  },
  selected: false,
};

Circle.propTypes = {
  circleStyling: PropTypes.object,
  pointStyling: PropTypes.object,
  selected: PropTypes.bool,
  onSelected: PropTypes.func.isRequired,
};

const Point = styled.div`
  width: 14px;
  height: 14px;
  white-space: nowrap;
  background-color: lightblue;
  margin-left: 3px;
  margin-top: 3px;

  transition: all 0.1s ease-out;
  border-radius: 100%;
`;

const CircleElement = styled.div`
  border-radius: 15px;
  cursor: pointer;
  display: block;
  
  :hover div {
    display: block !important;
  }
`;

export default Circle;
