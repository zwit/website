import React, { useState } from 'react';
import cx from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import { CardActionArea, Card, CardMedia, CardActions, Typography, CardContent, Button, TextField } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.backgroundColor,
    color: theme.color,
    display: 'inline-block',
    marginLeft: '20px',
    marginTop: '20px',
    width: '300px',
  },
  media: {
    height: 140,
  },
  actionArea: {
    minHeight: 100,
    color: theme.color,
    border: theme.mediaCard.actionArea,
  },
  action: {
    border: theme.mediaCard.actionArea,
    color: theme.color,
  },
  displayBlock: {
    display: 'block',
    color: theme.color,
  },
  button: {
    padding: '6px 8px',
    textTransform: 'uppercase',
    cursor: 'pointer',
  }
}));

const MediaCard = ({category, onClick, onDelete, onSave, className, isEditingProp = false}) => {
  const classes = useStyles();
  const [newEntity, setNewEntity] = useState(category);
  const [isEditing, toggleEditing] = useState(isEditingProp);

  return (
    <>
      <Card className={cx(classes.root, className)}>
        <CardActionArea onClick={onClick}>
          <CardMedia
            className={classes.media}
            image={category.get('image')}
            title={category.get('title')}
          />
          <CardContent className={classes.actionArea}>
            {!isEditing && <>
              <Typography gutterBottom variant="h5" component="h2">
                {category.get('title')}
              </Typography>
              <Typography variant="body2" component="p">
                {category.get('description')}
              </Typography>
            </>}

            {isEditing && <>
              <TextField 
                id="standard-basic" 
                className={classes.displayBlock}
                label="Title" 
                fullWidth
                value={newEntity.get('title')}
                onChange={(event) => setNewEntity(newEntity.set('title', event.target.value))}
              />
              <TextField 
                id="standard-basic"
                label="Description"
                fullWidth
                className={classes.displayBlock}
                value={newEntity.get('description')}
                onChange={(event) => setNewEntity(newEntity.set('description', event.target.value))}
              />
            </>}
          </CardContent>
        </CardActionArea>
        <CardActions className={classes.action}>
          {!isEditing && 
            <>
              <span className={classes.button} onClick={() => toggleEditing(!isEditing)}>
                Edit
              </span>
              <span className={classes.button} onClick={onDelete}>
                Delete
              </span>
            </>
          }
          {isEditing && 
            <>
              <span className={classes.button} onClick={() => {toggleEditing(!isEditing);onSave(newEntity)}}>
                Save
              </span>
              <span className={classes.button} onClick={() => toggleEditing(!isEditing)}>
                Cancel
              </span>
            </>
          }
        </CardActions>
      </Card>
    </>
  )
}

export default MediaCard;