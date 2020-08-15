import React from 'react';
import cx from 'classnames';
import SliderContext from './context'
import ShowDetailsButton from './ShowDetailsButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { TextField, CardActionArea, Card, CardMedia, Typography, CardContent } from '@material-ui/core';
import backgroundMedieval from '../../../images/background-medieval.png';
import Mark from './Mark';
import './Item.scss';

const Item = ({ activity, onClick, isSelected, displayEdition, onDelete, onEditTitle, onEditDescription }) => (
  <SliderContext.Consumer>
    {({ onSelectSlide, currentSlide, elementRef }) => {
      // const isActive = currentSlide && currentSlide.id === movie.id;
      return (
        <div
          ref={elementRef}
          className={cx('item', {
            // 'item--open': isActive,
          })}
        >
          <Card onClick={onClick} className={cx({
            'selected': isSelected,
          })}>
            <CardActionArea>
              <CardMedia
                component="img"
                alt="History"
                height="140"
                image={backgroundMedieval}
                title={"History"}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  {!displayEdition && activity.get('title')}
                  {displayEdition && <TextField 
                    id="standard-basic" 
                    label="Title" 
                    value={activity.get('title')}
                    onChange={onEditTitle}
                  />}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {!displayEdition && activity.get('description')}
                  {displayEdition && <TextField 
                    id="standard-basic" 
                    label="Description" 
                    style={{width: 250}}
                    value={activity.get('description')}
                    onChange={onEditDescription}
                  />}
                </Typography>
                {displayEdition && <DeleteIcon onClick={onDelete} />}
              </CardContent>
            </CardActionArea>
          </Card>
          {/* <ShowDetailsButton onClick={() => onSelectSlide(movie)} /> */}
          {/* {isActive && <Mark />} */}
        </div>
      );
    }}
  </SliderContext.Consumer>
);

export default Item;
