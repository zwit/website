import React from 'react';
import { Link } from 'react-router-dom';
import Connect from './Connect';
import TokenList from './TokenList';
import Web3ContextProvider from './Web3Context';
import { Button } from '@material-ui/core';
import styled from 'styled-components';

class Crypto extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedAddress: null,
    }

    this.setSelectedAddress = this.setSelectedAddress.bind(this);
  }

  setSelectedAddress(selectedAddress) {
    this.setState({
      selectedAddress,
    })
  }

  render() {
    const {
      selectedAddress
    } = this.state;

    return (
      <div style={{backgroundColor: 'black'}}>
        <HomeButton><Link to="/"><Button variant="contained">Home</Button></Link></HomeButton>
        <Web3ContextProvider>
          <Connect setSelectedAddress={this.setSelectedAddress}/>
          <TokenList/>
        </Web3ContextProvider>

        <style jsx global>{`
          body {
            background-color: black;
          }
          div {
            text-align: center;
            color: white;
          }
        `}</style>
      </div>
    );
  }
}

const HomeButton = styled.div`
  padding: 20px;
  a {
    text-decoration: none;
  }
`;

export default Crypto;