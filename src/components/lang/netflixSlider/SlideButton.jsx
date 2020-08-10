import React from 'react';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import './SlideButton.scss'

const SlideButton = ({ onClick, type }) => (
  <button className={`slide-button slide-button--${type}`} onClick={onClick}>
    <span>
      <ArrowDownwardIcon />
    </span>
  </button>
);

export default SlideButton;