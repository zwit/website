import React from 'react';
import PropTypes from 'prop-types';
import { intToRGB, hashCode, setMetamaskLogo } from '../../utils';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Copy } from 'react-feather';

export default class Connect extends React.Component {
  constructor(props) {
    super(props);

    this.setMetamaskFound = this.setMetamaskFound.bind(this);
    this.setSelectedAddress = this.setSelectedAddress.bind(this);
    this.handleConnect = this.handleConnect.bind(this);
    this.onCopy = this.onCopy.bind(this);

    this.state = {
      metamaskFound: false,
      selectedAddress: null,
      coinbase: null,
      originalBalance: null,
      currentBalance: null,
      account: null,
      rejectedEnable: false,
      gasPrice: null,
      copied: false,
    }
  }

  componentDidMount() {
    const metamaskFound = typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
    const selectedAddress =null;

    this.setState({
      metamaskFound,
      selectedAddress,
    });

    if (!selectedAddress) {
      setMetamaskLogo(250, 200, metamaskFound, selectedAddress, 'logo-container');
    } else if (selectedAddress) {
      setMetamaskLogo(25, 20, metamaskFound, selectedAddress, 'logo-container-mini');
    }
  }

  setMetamaskFound(metamaskFound) {
    this.setState({ metamaskFound });
  }

  setSelectedAddress(selectedAddress) {
    this.setState({ selectedAddress });
  }

  onCopy(selectedAddress) {
    this.setState({ copied: true });
  }

  async handleConnect() {
    const { metamaskFound } = this.state;

    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.enable();

        const account = accounts[0];

        this.setMetamaskLogo(25, 20, metamaskFound, 'logo-container-mini');

        this.setState({
          account,
        });
      } catch (error) {
        console.error("User denied account access");

        this.setState({
          rejectedEnable: true,
        });

        return;
      }

      
    }
  }

  render() {
    const {
      metamaskFound,
      selectedAddress,
      coinbase,
      originalBalance,
      currentBalance,
      account,
      rejectedEnable,
      gasPrice,
      copied,
    } = this.state;

    const colorBalance = selectedAddress && '#' + intToRGB(hashCode(selectedAddress));

    return (
      <div>
        <div onClick={this.handleConnect} id="logo-container"></div>

        {!metamaskFound &&
          <div>No Metamask Found</div>
        }

        {metamaskFound && !selectedAddress && (
          <span>
            <button onClick={this.handleConnect}>Connect Wallet</button>
          </span>
        )}

        <div className="address">
          <span id="logo-container-mini"></span>
          {selectedAddress &&
            <span>
              <span className="balance">
                <CopyToClipboard onCopy={this.onCopy} text={selectedAddress}>
                  <span>
                    {selectedAddress.substr(0, 4)}...{selectedAddress.substr(38, 43)}
                    <span className="copy-icon">
                      <Copy size={16} color={copied ? 'white' : 'black'} />
                    </span>
                  </span>
                </CopyToClipboard>
              </span>

              <span>{coinbase}{originalBalance}{currentBalance}{account}{gasPrice}</span>
            </span>
          }
        </div>

        <style jsx>{`
          .balance {
            padding: 10px;
            border-radius: 20px;
            background-color: ${colorBalance};
            cursor: pointer;
          }

          .address {
            text-align: right;
            margin-top: 20px;
          }

          #logo-container {
            cursor: ${metamaskFound ? 'pointer' : 'auto'};
            opacity: ${metamaskFound ? 1 : 0.5};
          }

          #logo-container-mini {
            vertical-align: middle;
            margin-right: 6px;
          }

          #logo-container-mini {
            vertical-align: middle;
            margin-right: 6px;
          }

          .copy-icon {
            vertical-align: middle;
            margin-left: 6px;
          }

          button {
            background-color: ${ rejectedEnable ? 'red' : '#4CAF50' };
            border: none;
            color: white;
            padding: 15px 32px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            cursor: pointer;
          }
        `}</style>
      </div>
    )
  }
}

Connect.propTypes = {
  setSelectedAddress: PropTypes.func.isRequired,
};