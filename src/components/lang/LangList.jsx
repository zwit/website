import React from 'react';
import PropTypes from 'prop-types';
import { TextField, FormControlLabel, Switch, Button, ButtonGroup } from '@material-ui/core';
import styled from 'styled-components';
import backgroundMedieval from '../../images/background-medieval.png';
import { Map, List } from 'immutable';
import { makeStyles } from '@material-ui/core/styles';
import SimpleCard from '../common/SimpleCard';
import Slider from '../common/Slider';
import debounce from 'debounce';

export default class LangList extends React.Component {
  constructor(props) {
    super(props);

    this.fetchIdeograms = this.fetchIdeograms.bind(this);
    this.setCharacter = this.setCharacter.bind(this);
    this.postIdeogram = this.postIdeogram.bind(this);
    this.toggleDisplayEdition = this.toggleDisplayEdition.bind(this);
    this.deleteIdeogram = this.deleteIdeogram.bind(this);
    this.generateRandomIndex = this.generateRandomIndex.bind(this);
    this.setSearched = this.setSearched.bind(this);
    this.selectLanguage = this.selectLanguage.bind(this);
    this.postLanguage = this.postLanguage.bind(this);
    this.deleteLanguage = this.deleteLanguage.bind(this);
    this.fetchLanguage = this.fetchLanguage.bind(this);

    this.debouncedPostIdeogram = debounce(
      this.postIdeogram.bind(this),
      500
    );

    this.state = {
      languageList: List(),
      ideogramList: List(),
      wordList: List(),
      displayEdition: false,
      randomIndex: null,
      searched: '',
      count: 0,
      selectedLanguage: null,
    }
  }

  componentDidMount() {
    this.fetchIdeograms();
    this.fetchWords();
    this.fetchLanguage();
  }

  toggleDisplayEdition() {
    const { displayEdition } = this.state;

    this.setState({
      displayEdition: !displayEdition,
    });
  }

  deleteIdeogram(ideogram) {
    fetch(`/api/ideogram/${ideogram.get('id')}`, {
      method: 'DELETE',
      body: JSON.stringify({})
    }).then(() => {
      this.fetchIdeograms();
    });
  }

  postIdeogram(ideogram) {
    fetch('/api/ideogram', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(ideogram)
    }).then(() => {
      this.fetchIdeograms();
    });
  }

  postWord(word) {
    fetch('/api/word', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(word)
    }).then(() => {
      this.fetchWords();
    });
  }

  fetchWords() {
    return fetch('/api/word')
      .then(res => res.json())
      .then(wordList => {
        this.setState({ 
          wordList: List(wordList.map(word => Map(word))),
        });
      });
  }

  fetchIdeograms() {
    return fetch('/api/ideogram')
      .then(res => res.json())
      .then(ideogramList => {
        this.setState({ 
          ideogramList: List(ideogramList.map(ideogram => Map(ideogram))),
        });
      });
  }

  setCharacter(index, ideogram) {
    const { ideogramList } = this.state;

    this.setState({ 
      ideogramList: ideogramList.set(index, ideogram),
    });

    this.debouncedPostIdeogram(ideogram);
  }

  generateRandomIndex(start, size) {
    this.setState({ 
      randomIndex: Math.floor((Math.random() * size)) + start,
      searched: '',
    });
  }

  setSearched(searched) {
    this.setState({ 
      searched,
    });
  }

  selectLanguage(selectedLanguage) {
    this.setState({ 
      selectedLanguage,
    });
  }

  fetchLanguage() {
    this.setState({ 
      languageList: List([{
        title: 'Chinese',
        description: 'learn chinese',
        image: backgroundMedieval
      }, {
        title: 'Japanese',
        description: 'learn japanese',
        image: backgroundMedieval
      }, {
        title: 'Russian',
        description: 'learn russian',
        image: backgroundMedieval
      }, {
        title: 'Italian',
        description: 'learn italian',
        image: backgroundMedieval
      }, {
        title: 'Arabic',
        description: 'learn arabic',
        image: backgroundMedieval
      }, {
        title: 'Turkish',
        description: 'learn turkish',
        image: backgroundMedieval
      }]).map(language => Map(language)),
    });
  }

  deleteLanguage(language) {
    fetch(`/api/language/${language.get('id')}`, {
      method: 'DELETE',
      body: JSON.stringify({})
    }).then(() => {
      this.fetchLanguage();
    });
  }

  postLanguage(language) {
    fetch('/api/language', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(language)
    }).then(() => {
      this.fetchLanguage();
    });
  }

  render() {
    const {
      ideogramList,
      languageList,
      displayEdition,
      randomIndex,
      searched,
      wordList,
      selectedLanguage,
    } = this.state;

    let buttonList = List();
    const jump = 50;
    for (let index = 0; index < ideogramList.size; index+=jump) {
      buttonList = buttonList.push({ start: index, end: ideogramList.size > index + jump ? index + jump : ideogramList.size - 1 });
    }

    const itemSearched = (searched !== '' || randomIndex !== null) && 
      searched !== '' ? ideogramList.find(ideogram => ideogram.get('text') === searched) :
      ideogramList.get(randomIndex);

    return (
      <div>
        <Slider
          entityList={languageList}
          selectEntity={this.selectLanguage}
          displayEdition={false}
          deleteEntity={this.deleteLanguage}
          postEntity={this.postLanguage}
          selectedEntity={selectedLanguage}
        />

        <ButtonGroup variant="text" color="primary" aria-label="text primary button group">
          <Button>Ideogram</Button>
          <Button>Word</Button>
          <Button>Sentence</Button>
        </ButtonGroup>

        <FormControlLabel
          control={<Switch
            checked={displayEdition}
            onChange={this.toggleDisplayEdition}
            name="checkedB"
            color="primary"
          />}
          label="Editer"
        />

        <TextField
          label="searched" 
          value={searched} 
          onChange={(event) => this.setSearched(event.target.value)} 
        />

        <Button 
          variant="contained" 
          onClick={() => this.generateRandomIndex(0, ideogramList.size)}
        >
          Get Random all
        </Button>

        {buttonList.map(sample => (<Button 
          variant="contained" 
          onClick={() => this.generateRandomIndex(sample.start, sample.end - sample.start)}
        >
          {sample.start} - {sample.end}
        </Button>))}

        <div className="mt5">
        <div style={{float: 'left'}}>
          {itemSearched && 
            <SimpleCard
              isEditing={displayEdition}
              character={itemSearched}
              setCharacter={this.setCharacter}
              deleteCharacter={this.deleteIdeogram}
            />
          }

        {displayEdition && <SimpleCard
          isEditing={true}
          character={Map({description: '', text: '', language: {name: 'Chinese'}})}
          setCharacter={this.setCharacter}
        />}
        </div>
        <div style={{float: 'right', width: '74%'}}>
        {itemSearched && wordList
          .filter(word => word.get('text')
            .match(itemSearched.get('text')) && word.get('text') !== itemSearched.get('text')
          )
          .map((word, index) => (
          <div style={{float: 'left', margin: '5px'}}><SimpleCard
            isEditing={false}
            character={word}
            setCharacter={this.setWord}
            onClickCaracter={this.setSearched}
            opened
            displayIndex
          /></div>
        ))}
        </div>
        
        </div>

        <div id="div"></div>
        <div id="ideo"></div>
      </div>
    )
  }
}

LangList.propTypes = {
};