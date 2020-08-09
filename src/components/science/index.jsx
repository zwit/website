import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@material-ui/core';
import styled from 'styled-components';

const Science = () => (
  <div>
    <HomeButton><Link to="/"><Button variant="contained">Home</Button></Link></HomeButton>
  </div>
)

const HomeButton = styled.div`
  padding: 20px;
  a {
    text-decoration: none;
  }
`;

export default Science;