import React, { useState } from 'react';
import cx from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import { CardActionArea, Card, CardMedia, CardActions, Typography, CardContent, Button, TextField } from '@material-ui/core';

const useStyles = makeStyles({
  root: {
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
  },
  displayBlock: {
    display: 'block',
  }
});

const SimpleCard = ({category, onClick, onDelete, onSave, className, isEditingProp = false}) => {
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
              <Typography variant="body2" color="textSecondary" component="p">
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
        <CardActions>
          {!isEditing && 
            <>
              <Button size="small" color="primary" onClick={() => toggleEditing(!isEditing)}>
                Edit
              </Button>
              <Button size="small" color="primary" onClick={onDelete}>
                Delete
              </Button>
            </>
          }
          {isEditing && 
            <>
              <Button onClick={() => onSave(newEntity)} size="small" color="primary">
                Save
              </Button>
              <Button onClick={() => toggleEditing(!isEditing)} size="small" color="primary">
                Cancel
              </Button>
            </>
          }
        </CardActions>
      </Card>
    </>
  )
}

export default SimpleCard;