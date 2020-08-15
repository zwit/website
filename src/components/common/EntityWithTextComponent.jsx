import React from 'react';
import PropTypes from 'prop-types';
import { Map, List } from 'immutable';
import debounce from 'debounce';
import TextEditor from './TextEditor';
import { Switch, FormControlLabel, CircularProgress } from '@material-ui/core';
import { apiPath } from '../../utils';
import Slider from '../common/Slider';

class EntityWithTextComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      entityList: null,
      selectedEntity: null,
      displayEdition: false,
      newEntity: Map({ title: '', description: '' }),
    }

    this.fetchEntity = this.fetchEntity.bind(this);
    this.debouncedPostEntity = debounce(
      this.postEntity.bind(this),
      500
    );
    this.deleteEntity = this.deleteEntity.bind(this);
    this.selectEntity = this.selectEntity.bind(this);
    this.toggleDisplayEdition = this.toggleDisplayEdition.bind(this);
  }

  componentDidMount() {
    this.fetchEntity();
  }

  fetchEntity() {
    const { selectedEntity } = this.state;
    const { entityType } = this.props;

    fetch(`${apiPath}/${entityType}`)
      .then(res => res.json())
      .then(entityList => {
        const stateEntityList = List(entityList.map(entity => Map(entity)));
        this.setState({ 
          entityList: stateEntityList,
        });

        if (!selectedEntity) {
          this.selectEntity(stateEntityList.get(0));
        }
      });
  }

  postEntity(entity) {
    const { entityType } = this.props;

    fetch(`${apiPath}/${entityType}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(entity)
    }).then(() => {
      this.fetchEntity();
      this.setState({ 
        newEntity: Map({ title: '', description: '' }),
      });
    });
  }

  deleteEntity(entity) {
    const { entityType } = this.props;

    fetch(`${apiPath}/${entityType}/${entity.get('id')}`, {
      method: 'DELETE',
      body: JSON.stringify({})
    }).then(() => {
      this.fetchEntity();
    });
  }

  selectEntity(selectedEntity) {
    this.setState({ 
      selectedEntity,
    });
  }

  setEntityList(field, value) {
    const { entityList, selectedEntity } = this.state;

    const entityListIndex = entityList.findIndex(date => date.get('id') === selectedEntity.get('id'));

    const newEntityList = entityList.setIn([entityListIndex, field], value);

    this.setState({
      entityList: newEntityList,
    })

    this.debouncedPostEntity(newEntityList.get(entityListIndex));
  }

  toggleDisplayEdition() {
    const { displayEdition } = this.state;

    this.setState({ 
      displayEdition: !displayEdition,
    });
  }

  render() {
    const { entityList, selectedEntity } = this.state;

    if (!entityList) {
      return (<div style={{textAlign: 'center'}}>
        <CircularProgress />
      </div>)
    }

    return (
      <div>
        <Slider
          entityList={entityList}
          selectEntity={this.selectEntity}
          displayEdition={false}
          deleteEntity={this.deleteEntity}
          postEntity={this.postEntity}
          selectedEntity={selectedEntity}
        />

        <div><FormControlLabel
          control={<Switch
            checked={false}
            onChange={this.toggleDisplayEdition}
            name="checkedB"
            color="primary"
          />}
          label="Editer"
        /></div>

        {entityList.map((entity) => (
          <>
            {selectedEntity && selectedEntity.get('id') === entity.get('id') &&  (
              <TextEditor
                text={selectedEntity.get('text')}
                onChangeText={(text) => this.setEntityList('text', text)}
              />
            )}
          </>
        ))}
      </div>
    );
  }
}

EntityWithTextComponent.propTypes = {
  entityType: PropTypes.string.isRequired,
};

export default EntityWithTextComponent;
