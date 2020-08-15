import React from 'react';
import { Map, List } from 'immutable';
import { Switch, FormControlLabel } from '@material-ui/core';
import Slider from '../common/Slider';
import TextEditor from '../common/TextEditor';
import debounce from 'debounce';
import EntityWithTextComponent from '../common/EntityWithTextComponent';

export default class Books extends React.Component {
  render() {
    return (
      <div>
        <EntityWithTextComponent entityType={'book'} />
      </div>
    );
  }
}

Books.propTypes = {
};
