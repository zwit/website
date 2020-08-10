import React from 'react';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import './ShowDetailsButton.scss'

const ShowDetailsButton = ({ onClick }) => (
  <button onClick={onClick} className="show-details-button">
    <span>
      <ArrowDownwardIcon />
    </span>
  </button>
);

export default ShowDetailsButton;
