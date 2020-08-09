import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { EWEI, getValueIn } from '../../utils';
import { Web3Context } from './Web3Context';

const Web3 = require('web3')

export default class TokenList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedAddress: null,
      balance: null,
    }
  }

  componentDidMount() {
    const { web3js } = this.context;

    web3js.eth.getAccounts()
      .then((address) => this.setState({
        selectedAddress: address,
      })
    );
    web3js.eth.getBlockNumber().then(console.log());
    web3js.eth.getBalance('0x4b69D6081ff943AFd0c6561c3DA5Ac563CE4CdFB')
      .then((balance) => this.setState({
        balance: web3js.utils.fromWei(balance),
      })
    );
      web3js.eth.getGasPrice()
.then(console.log);

web3js.eth.subscribe('syncing', function(error, sync){
    if (!error)
        console.log(sync);
})


   web3js.eth.getBlock(3150)
    .then(console.log);
  }

  render() {
    const {
      balance,
      selectedAddress,
    } = this.state;

    return (
      <div>
        {selectedAddress && <div>
          <img className="token-logo" src="https://s3.amazonaws.com/icons.assets/ETH.png"/>
          {' '}
          {balance && balance}
        </div>}

        <style jsx>{`
          .token-logo {
            height: 28px;
            width: 28px;
            vertical-align: middle;
          }
        `}</style>
      </div>
    )
  }
}

TokenList.contextType = Web3Context;

