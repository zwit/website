import React from 'react';
import './App.css';
import styled from 'styled-components';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import History from './components/History';
import Home from './components/Home';
import Lang from './components/lang';
import Science from './components/Science';
import Crypto from './components/crypto';
import Book from './components/Book';
import Art from './components/Art';
import Stats from './components/Stats';
import Ml from './components/Ml';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Content>
        <BrowserRouter>
          <Switch>
            <Route exact path='/' component={Home} />
            <Route path='/history' component={History} />
            <Route path='/lang' component={Lang} />
            <Route path='/science' component={Science} />
            <Route path='/crypto' component={Crypto} />
            <Route path='/book' component={Book} />
            <Route path='/art' component={Art} />
            <Route path='/stats' component={Stats} />
            <Route path='/ml' component={Ml} />
          </Switch>
        </BrowserRouter>
      </Content>
    );
  }
}

const Content = styled.div`
  padding: 20px;
`;

export default App;
