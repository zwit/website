import React from 'react';
import PropTypes from 'prop-types';

export default class LangList extends React.Component {
  constructor(props) {
    super(props);

    this.setSelectedAddress = this.setSelectedAddress.bind(this);

    this.state = {
      selectedAddress: null
    }
  }

  componentDidMount() {
  }


  setSelectedAddress(selectedAddress) {
    this.setState({ selectedAddress });
  }

  render() {
    const {
      selectedAddress,
    } = this.state;

    return (
      <div>
        
      </div>
    )
  }
}

LangList.propTypes = {
};