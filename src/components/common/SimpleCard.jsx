import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { TextField } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import TranslateIcon from '@material-ui/icons/Translate';
import LinkIcon from '@material-ui/icons/Link';
import { stringToColour } from './utils';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    maxWidth: 300,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  caracter: {
    cursor: 'pointer',
    '&:hover': {
      color: 'red !important',
    }
  },
  translate: {
    paddingBottom: 10,
    float: 'right',
  },
  title: {
    fontSize: 14,
  },
  text: {
    paddingBottom: 10,
  },
  pos: {
    marginBottom: 12,
  },
});

export default function SimpleCard({character, isEditing, setCharacter, deleteCharacter, onClickCaracter, opened = false, displayIndex = false}) {
  const classes = useStyles();
  const [displayTranslation, toggleTranslation] = useState(opened);
  const bull = <span className={classes.bullet}>•</span>;

  return (
    <Card className={classes.root}>
      <CardContent>        
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          {!isEditing && character.get('language') && character.get('language').name}
          {isEditing && character.get('language') && <TextField
            label="lang name" 
            value={character.get('language').name} 
            //onChange={(event) => setCharacter(character.set('language', event.target.value))} 
          />}
        </Typography>
        <Typography variant="h5" component="span" className={classes.text}>
          {!isEditing && [...character.get('text')].map((c) => (
            <span className={classes.caracter} style={{color: stringToColour(c)}} onClick={() => onClickCaracter(c)}>{c}</span>
          ))}
          {isEditing && <TextField
            label="text" 
            value={character.get('text')} 
            onChange={(event) => setCharacter(character.set('text', event.target.value))} 
          />}
        </Typography>
        {!isEditing && <Button size="small" className={classes.translate} onClick={() => toggleTranslation(!displayTranslation)}><TranslateIcon/></Button>}
        <Button size="small" className={classes.translate}><a target="_blank" href={`https://translate.google.fr/?hl=fr#view=home&op=translate&sl=zh-CN&tl=fr&text=${character.get('text')}`}><LinkIcon/></a></Button>
        {!isEditing && displayTranslation && <Typography className={classes.pos} color="textSecondary">
          {character.get('description')}
        </Typography>}
        {isEditing && <Typography className={classes.pos} color="textSecondary">
          <TextField
            label="description" 
            value={character.get('description')} 
            onChange={(event) => setCharacter(character.set('description', event.target.value))} 
          />
        </Typography>}
        {!isEditing && displayTranslation && <Typography className={classes.pos} color="textSecondary">
          {character.get('translation')}
        </Typography>}
        {isEditing && <Typography className={classes.pos} color="textSecondary">
          <TextField
            label="translation" 
            value={character.get('translation')} 
            onChange={(event) => setCharacter(character.set('translation', event.target.value))} 
          />
        </Typography>}
        {displayTranslation && character.get('id')}
      </CardContent>
      <CardActions>
        {isEditing && <DeleteIcon onClick={() => deleteCharacter(character)} />}
      </CardActions>
    </Card>
  );
}