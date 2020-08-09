import React from 'react';
import TimeLine from './TimeLine';
import { Link } from 'react-router-dom';
import { Button } from '@material-ui/core';
import styled from 'styled-components';

const History = () => (
  <div>
    <HomeButton><Link to="/"><Button variant="contained">Home</Button></Link></HomeButton>

    <TimeLine
      startDate={'2000-01-01'}
      endDate={'2020-01-01'}
      pointSize={20}
      lineHeight={50}
    />
  </div>
)

const HomeButton = styled.div`
  padding: 20px;
  a {
    text-decoration: none;
  }
`;

export default History;