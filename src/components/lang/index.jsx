import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@material-ui/core';
import styled from 'styled-components';
import LangList from './LangList';

const Lang = () => (
  <div>
    <HomeButton><Link to="/"><Button variant="contained">Home</Button></Link></HomeButton>
    <LangList/>
  </div>
)

const HomeButton = styled.div`
  padding: 20px;
  a {
    text-decoration: none;
  }
`;

export default Lang;