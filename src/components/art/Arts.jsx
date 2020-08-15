import React from 'react';
import TimeLineComponent from '../common/TimeLineComponent';

export default class Arts extends React.Component {
  constructor(props) {
    super({...props, entityType: 'art'});

    this.state = {
      displayEdition: false,
    }
  }

  render() {
    const {
      entityList,
      displayEdition
    } = this.state;

    return (
      <div>
        <TimeLineComponent 
          type={'art'}
          displaySlider={false}
        />
      </div>
    );
  }
}

Arts.propTypes = {
};
