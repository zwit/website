import React from 'react';
import cx from 'classnames';
import SliderContext from './context'
import ShowDetailsButton from './ShowDetailsButton'
import { CardActionArea, Card, CardMedia, Typography, CardContent } from '@material-ui/core';
import backgroundMedieval from '../../../images/background-medieval.png';
import Mark from './Mark'
import './Item.scss'

const Item = ({ movie }) => (
  <SliderContext.Consumer>
    {({ onSelectSlide, currentSlide, elementRef }) => {
      const isActive = currentSlide && currentSlide.id === movie.id;

      return (
        <div
          ref={elementRef}
          className={cx('item', {
            'item--open': isActive,
          })}
        >
          <Card>
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
                  {movie.title}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {movie.title} language
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
          <ShowDetailsButton onClick={() => onSelectSlide(movie)} />
          {isActive && <Mark />}
        </div>
      );
    }}
  </SliderContext.Consumer>
);

export default Item;
