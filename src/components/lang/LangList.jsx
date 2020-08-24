import React from 'react';
import PropTypes from 'prop-types';
import { TextField, FormControlLabel, Switch, Button, ButtonGroup, CircularProgress } from '@material-ui/core';
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
      isLoading: true,
    }
  }

  componentDidMount() {
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
    const { selectedLanguage } = this.state;

    fetch('/api/ideogram', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(ideogram.set('language', selectedLanguage))
    }).then(() => {
      this.fetchIdeograms();
    });
  }

  postWord(word) {
    const { selectedLanguage } = this.state;

    fetch('/api/word', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(word.set('language', selectedLanguage))
    }).then(() => {
      this.fetchWords();
    });
  }

  fetchWords(lang) {
    return fetch(`/api/word?where={"language": "${lang.get('id')}"}`)
      .then(res => res.json())
      .then(wordList => {
        this.setState({ 
          wordList: List(wordList.map(word => Map(word))),
        });
      });
  }

  fetchIdeograms(lang) {
    return fetch(`/api/ideogram?where={"language": "${lang.get('id')}"}`)
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

  async selectLanguage(selectedLanguage) {
    this.setState({ 
      selectedLanguage,
      isLoading: true,
    });

    await this.fetchIdeograms(selectedLanguage);
    await this.fetchWords(selectedLanguage);

    this.setState({
      isLoading: false,
    });
  }

  fetchLanguage() {
    return fetch('/api/language')
      .then(res => res.json())
      .then((languageList) => {
        const newLanguageList = List(languageList.map(lang => Map(lang)));

        this.setState({ 
          languageList: newLanguageList,
        });

        this.selectLanguage(newLanguageList.get(0));
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
      isLoading,
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
      <div style={{minHeight: '1000px'}}>
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
          character={Map({description: '', text: '', language: selectedLanguage})}
          setCharacter={this.setCharacter}
        />}
        </div>
        <div style={{float: 'right', width: '74%', height: '500px', overflow: 'scroll'}}>
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

        {isLoading && <div style={{textAlign: 'center'}}>
            <CircularProgress />
          </div>
        }

        <div id="div"></div>
        <div id="ideo"></div>
      </div>
    )
  }
}

LangList.propTypes = {
};