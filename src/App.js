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
import Geopol from './components/Geopol';
import Culture from './components/Culture';
import GeoEdit from './components/GeoEdit';
import CssBackgrounds from './components/CssBackgrounds';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
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
            <Route path='/geopol' component={Geopol} />
            <Route path='/culture' component={Culture} />
            <Route path='/hinkingOfflineMap' component={GeoEdit} />
            <Route path='/cssBackgrounds' component={CssBackgrounds} />
          </Switch>
        </BrowserRouter>
      </>
    );
  }
}

export default App;
