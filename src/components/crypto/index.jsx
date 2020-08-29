import React, { useState } from 'react';
import Connect from './Connect';
import TokenList from './TokenList';
import Web3ContextProvider from './Web3Context';
import { makeStyles } from '@material-ui/core/styles';
import Content from '../common/Content';

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: 'center',
  },
}));

const Crypto = () => {
  const [selectedAddress, setSelectedAddress] = useState(null);

  const classes = useStyles();

  return (
    <Content>
      <div className={classes.root}>
        <Web3ContextProvider>
          <Connect setSelectedAddress={setSelectedAddress}/>
          <TokenList/>
        </Web3ContextProvider>
      </div>
    </Content>
  );
}

export default Crypto;