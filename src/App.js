import React from 'react';
import './App.css';
import styled from 'styled-components';
import middleage from './images/middleage.jpg';
import backgroundMedieval from './images/background-medieval.png';

import { BrowserRouter, Route, Switch } from 'react-router-dom';

import History from './components/history';
import Home from './components/home';
import Lang from './components/lang';
import Science from './components/science';
import Crypto from './components/crypto';

class App extends React.Component {
  constructor(props) {
    super(props);

      }

  componentDidMount() {
    // fetch('/activity/2', {
    //   method: 'DELETE',
    //   headers: {
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify()
    // });
    // fetch('/event', {
    //   method: 'POST',
    //   headers: {
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(Map({ activity: {title: 'Romains', description: 'République puis Empire'}, date: '2003', endDate: '2006', text: 'some text range 2', color: 'white', type: 'range', background: "repeating-linear-gradient\(45deg, #606dbc, #606dbc 10px, #465298 10px, #465298 20px)", 'innerText': 'some range'}))
    // });
    // fetch('/event', {
    //   method: 'POST',
    //   headers: {
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(Map({ activity: {id: 1}, date: '2001-01-01', text: 'some text', type: 'point'}))
    // });
  //   fetch('/event', {
  //     method: 'POST',
  //     headers: {
  //       'Accept': 'application/json',
  //       'Content-Type': 'application/json'
  //     },
  //   body: JSON.stringify(Map({  activity: {id: 1}, date: '2002', endDate: '2003', text: 'some text range', color: 'white', type: 'range', background: 'green', 'innerText': 'some range'}))
  // });
  // fetch('/event', {
  //     method: 'POST',
  //     headers: {
  //       'Accept': 'application/json',
  //       'Content-Type': 'application/json'
  //     },body: JSON.stringify(Map({ activity: {title: 'Grecs', description: 'Petites cités face aux Perses et Romains'}, date: '2003', endDate: '2006', text: 'some text range 2', color: 'white', type: 'range', background: "repeating-linear-gradient\(45deg, #606dbc, #606dbc 10px, #465298 10px, #465298 20px)", 'innerText': 'some range'}))
  //   });
  // fetch('/event', {
  //       method: 'POST',
  //       headers: {
  //         'Accept': 'application/json',
  //         'Content-Type': 'application/json'
  //       },body: JSON.stringify(Map({ activity: {id: 1}, date: '2006', endDate: '2007', text: 'some text range 2', color: 'white', type: 'range', background: "repeating-radial-gradient\(circle, purple, purple 1px, #4b026f 10px, #4b026f 20px)", 'innerText': 'some range'}))
  //     });
  // fetch('/event', {
  //         method: 'POST',
  //         headers: {
  //           'Accept': 'application/json',
  //           'Content-Type': 'application/json'
  //         },body: JSON.stringify(Map({ activity: {id: 3}, date: '2007', endDate: '2008', text: 'some text range 2', color: 'white', type: 'range', background: "repeating-linear-gradient\(to right, #f6ba52, #f6ba52 10px, #ffd180 10px, #ffd180 20px)", 'innerText': 'some range'}))
  //       });
  // fetch('/event', {
  //           method: 'POST',
  //           headers: {
  //             'Accept': 'application/json',
  //             'Content-Type': 'application/json'
  //           },body: JSON.stringify(Map({ activity: {id: 1}, date: '2008', endDate: '2009', text: 'some text range 2', color: 'white', type: 'range', background: "repeating-linear-gradient(-55deg, #222, #222 10px, #333 10px, #333 20px)", 'innerText': 'some range'}))
  //         });
  // fetch('/event', {
  //             method: 'POST',
  //             headers: {
  //               'Accept': 'application/json',
  //               'Content-Type': 'application/json'
  //             },body: JSON.stringify(Map({ activity: {id: 3}, date: '1995', endDate: '2000', text: 'some text range 2', color: 'white', type: 'range', background: `repeating-linear-gradient(45deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2) 10px, rgba(0, 0, 0, 0.3) 10px, rgba(0, 0, 0, 0.3) 20px),url(${backgroundMedieval})`, 'innerText': 'some range'}))});

  }

  render() {
    return (
      <Content>
        {/* <Motion defaultStyle={{x: 0}} style={{x: spring(10)}}>
          {value => <div>{value.x}</div>}
        </Motion> */}

        <BrowserRouter>
          <Switch>
            <Route exact path='/' component={Home} />
            <Route path='/history' component={History} />
            <Route path='/lang' component={Lang} />
            <Route path='/science' component={Science} />
            <Route path='/crypto' component={Crypto} />
          </Switch>
        </BrowserRouter>
      </Content>
    );
  }
}

const Content = styled.div`
  margin-top: 10px;
`;

export default App;
