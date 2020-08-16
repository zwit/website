import React from 'react';
import TimeLineComponent from './common/TimeLineComponent';
import { Link } from 'react-router-dom';
import { Button } from '@material-ui/core';
import styled from 'styled-components';

const History = () => (
  <div>
    <HomeButton><Link to="/"><Button variant="contained">Home</Button></Link></HomeButton>

    <TimeLineComponent type='history'/>
  </div>
)

const HomeButton = styled.div`
  a {
    text-decoration: none;
  }
`;

export default History;