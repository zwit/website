import React from 'react';
const Web3 = require('web3')

export const Web3Context = React.createContext('light');

const Web3ContextProvider = props => (
  <Web3Context.Provider value={{web3js: new Web3(Web3.givenProvider || "ws://localhost:8545")}}>{props.children}</Web3Context.Provider>
)

export default Web3ContextProvider;