import React from 'react';
import { TextField, FormControlLabel, Switch, Button, ButtonGroup, CircularProgress } from '@material-ui/core';
import { withStyles } from "@material-ui/core/styles";
import { Map, List } from 'immutable';
import SimpleCard from '../common/SimpleCard';
import Slider from '../common/Slider';
import debounce from 'debounce';

class LangList extends React.Component {
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
    this.setSelectedFocus = this.setSelectedFocus.bind(this);

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
      selectedFocus: 'ideogram',
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
        const newIdeogramList = List(ideogramList.map(ideogram => Map(ideogram)));
        this.setState({
          ideogramList: newIdeogramList,
        });

        return newIdeogramList;
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

    const ideogramList = await this.fetchIdeograms(selectedLanguage);
    await this.fetchWords(selectedLanguage);

    this.setSelectedFocus(ideogramList.size ? 'ideogram' : 'word');

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

  setSelectedFocus(selectedFocus) {
    const { ideogramList, wordList } = this.state;

    this.setState({ 
      selectedFocus,
    });

    this.generateRandomIndex(0, selectedFocus === 'ideogram' ? ideogramList.size : wordList.size)
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
      selectedFocus,
    } = this.state;

    let buttonList = List();
    const jump = selectedFocus === 'ideogram' ? 50 : 200;
    const focusList = selectedFocus === 'ideogram' ? ideogramList : wordList;

    for (let index = 0; index < focusList.size; index+=jump) {
      buttonList = buttonList.push({ start: index, end: focusList.size > index + jump ? index + jump : focusList.size - 1 });
    }

    const itemSearched = (searched !== '' || randomIndex !== null) && 
      searched !== '' ? focusList.find(ideogram => ideogram.get('text') === searched) :
      focusList.get(randomIndex);
    
    const { classes } = this.props;

    return (
      <div style={{minHeight: '1100px'}}>
        <Slider
          entityList={languageList}
          selectEntity={this.selectLanguage}
          displayEdition={false}
          deleteEntity={this.deleteLanguage}
          postEntity={this.postLanguage}
          selectedEntity={selectedLanguage}
        />

        {!isLoading && <div>
          <div className={classes.buttonGroup}>
            <ButtonGroup variant="text" color="primary" aria-label="text primary button group">
              {ideogramList.size && <Button onClick={() => this.setSelectedFocus('ideogram')}>Ideogram</Button>}
              <Button onClick={() => this.setSelectedFocus('word')}>Word</Button>
              <Button onClick={() => this.setSelectedFocus('sentence')}>Sentence</Button>
            </ButtonGroup>
          </div>

          {/* <FormControlLabel
            control={<Switch
              checked={displayEdition}
              onChange={this.toggleDisplayEdition}
              name="checkedB"
              color="primary"
            />}
            label="Editer"
          /> */}

          <TextField
            label="searched" 
            value={searched} 
            onChange={(event) => this.setSearched(event.target.value)} 
          />

          <div className={classes.buttonGroup}>
            <Button 
              className={classes.button}
              onClick={() => this.generateRandomIndex(0, focusList.size)}
            >
              Get Random all
            </Button>

            {buttonList.map(sample => (<Button
              className={classes.button}
              onClick={() => this.generateRandomIndex(sample.start, sample.end - sample.start)}
            >
              {sample.start} - {sample.end}
            </Button>))}
          </div>

          {selectedFocus === 'ideogram' && <div className="mt5">
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
                <div style={{float: 'left', margin: '5px'}}>
                  <SimpleCard
                    isEditing={false}
                    character={word}
                    setCharacter={this.setWord}
                    onClickCaracter={this.setSearched}
                    opened
                    displayIndex
                  />
                </div>
              ))}
            </div>
          </div>}

          {selectedFocus === 'word' && <div className="mt5">
            <div style={{float: 'left'}}>
              {itemSearched && 
                <SimpleCard
                  isEditing={displayEdition}
                  character={itemSearched}
                  setCharacter={this.setWord}
                  deleteCharacter={this.deleteWord}
                />
              }

              {displayEdition && <SimpleCard
                isEditing={true}
                character={Map({description: '', text: '', language: selectedLanguage})}
                setCharacter={this.setCharacter}
              />}
            </div>

            <div style={{float: 'right', width: '74%', height: '500px', overflow: 'scroll'}}>
              {itemSearched && ideogramList
                .filter(ideogram => itemSearched.get('text')
                  .includes(ideogram.get('text')) && ideogram.get('text') !== itemSearched.get('text')
                )
                .map((ideogram, index) => (
                <div style={{float: 'left', margin: '5px'}}>
                  <SimpleCard
                    isEditing={false}
                    character={ideogram}
                    setCharacter={this.setCharacter}
                    onClickCaracter={this.setSearched}
                    opened
                    displayIndex
                  />
                </div>
              ))}
            </div>
          </div>}
        </div>}

        {isLoading && 
          <div style={{textAlign: 'center'}}>
            <CircularProgress />
          </div>
        }

        <div id="div"></div>
        <div id="ideo"></div>
      </div>
    )
  }
}

const styles = theme => ({
  button: {
    color: theme.color,
    border: `1px solid ${theme.color}`,
  },
  buttonGroup: {
    textAlign: 'center',
    marginTop: 10,
  }
});

export default withStyles(styles, { withTheme: true })(LangList);
